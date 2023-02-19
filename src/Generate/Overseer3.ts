import * as ROT from 'rot-js'
import { Entity, EntityKey, EntityPool, Region } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import { HSLToHex } from '../lib/color'
import { point, Point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { rnd } from '../lib/util'

export type Snapshot = {
  terrainMap: Map<Point, Entity>
  entityList: Entity[]
  message: string
}

function createSnapshot(
  terrainMap: Map<Point, Entity>,
  entityList: Entity[],
  message = ''
): Snapshot {
  return { terrainMap: new Map([...terrainMap]), entityList: [...entityList], message }
}

export type RegionTheme = {
  wall: EntityKey
  floor: EntityKey
  door: EntityKey
}

export class Overseer3 {
  rect: Rect
  pool: EntityPool

  timeStart = Date.now()
  timeEnd = 0

  history: Snapshot[] = []

  theme: RegionTheme = { wall: 'dungeonWall', floor: 'dirtFloor', door: 'woodenDoor' }

  debugSymbolList: Entity[] = []
  debugCNMap = new Map<Point, Entity>()

  constructor(readonly region: Region) {
    this.rect = region.rect
    this.pool = region.pool
    console.log(
      `%c  O3: ${region.name} - Area: ${region.width * region.height} `,
      'font-weight: bold; background-color: orange;'
    )
  }

  snap(message = '') {
    this.history.push(createSnapshot(this.region.terrainMap, this.region.entityList, message))
  }

  wall(pt: Point) {
    if (!this.region.terrainAt(pt).wall) {
      this.region.create(pt, this.theme.wall)
    }
  }

  floor(area: Point | Rect) {
    if (area instanceof Rect) {
      area.traverse(pt => {
        if (!this.region.terrainAt(pt).floor) this.region.create(pt, this.theme.floor)
      })
    } else {
      if (!this.region.terrainAt(area).floor) this.region.create(area, this.theme.floor)
    }
  }

  door(pt: Point) {
    if (this.region.at(pt).filter(e => e.door).length === 0) this.region.create(pt, this.theme.door)
  }

  room(rect: Rect, snapMsg?: string) {
    rect.traverse((pt, edge) => {
      edge ? this.wall(pt) : this.floor(pt)
    })

    if (snapMsg) this.snap(snapMsg)
  }

  add(area: Point | Rect, key: EntityKey, snapMsg?: string) {
    if (area instanceof Rect) {
      area.traverse(pt => {
        this.region.create(pt, key)
      })
    } else {
      this.region.create(area, key)
    }
    if (snapMsg) this.snap(snapMsg)
  }

  clear(pt: Point | Rect) {
    if (pt instanceof Rect) {
      pt.traverse(pt => this.clear(pt))
      return
    }

    const [_terrain, ...entities] = this.region.at(pt)
    entities.forEach(e => {
      if (e.key !== 'shadow') this.region.destroyEntity(e)
    })
  }

  path(pt1: Point, pt2: Point, key: EntityKey, passAll = false) {
    const passFn = passAll ? () => true : this.region.ROTisPassable.bind(this.region)
    const pathFn = new ROT.Path.AStar(pt2.x, pt2.y, passFn, { topology: rnd(1) ? 4 : 8 })
    pathFn.compute(pt1.x, pt1.y, (x, y) => {
      const pPt = point(x, y)
      this.clear(pPt)
      this.add(pPt, key)
    })
  }

  building(pt: Point, sign?: 'blank' | 'weapon' | 'potion' | 'inn') {
    this.clear(Rect.atC(pt, 3, 4))
    const pt1 = pt.add(0, -2)
    const pt2 = pt.add(0, -1)
    const pt4 = pt.add(0, 1)

    this.add(pt1.west(1), 'buildingChimney')
    this.add(pt1, 'buildingRoof')
    this.add(pt1.east(1), 'buildingRoof')

    this.add(pt2.west(1), 'buildingRoofFront')
    this.add(pt2, 'buildingRoofFront')
    this.add(pt2.east(1), 'buildingRoofFront')

    this.add(pt.west(1), 'buildingWindow')
    this.add(pt, 'buildingEntry')
    this.add(pt.east(1), 'buildingWindow')

    this.add(pt4.west(), 'shadow')
    this.add(pt4, 'shadow')
    this.add(pt4.east(), 'shadow')

    if (sign) {
      switch (sign) {
        case 'blank':
          this.add(pt.east(2), 'signBlank')
          break
        case 'weapon':
          this.add(pt.east(2), 'signWeapon')
          break
        case 'potion':
          this.add(pt.east(2), 'signPotion')
          break
        case 'inn':
          this.add(pt.east(2), 'signInn')
          break
      }
    }
  }

  portal(pt: Point, terrain: EntityKey, zone: string, level: 'down' | 'up' | number) {
    const tPortal = this.region.create(pt, terrain)
    if (!tPortal) return
    tPortal.portal = { zone, level }
  }

  debugSymbolN(pt: Point, n: number, color = 'transparent', bgColor = 'transparent') {
    const s = n.toString()
    s.split('').forEach((c, i) => {
      const d = this.pool.spawn('debug', i === 0 ? pt : pt.east(i))
      this.pool.attach(d, this.pool.C.sprite(this.pool.sprites, { base: [c] }))

      this.debugSymbolList.push(d)
      this.region.entityList.push(d)
    })
  }

  debugSymbol(area: Point | Rect, n: number) {
    const symbols = ['auraHoly', 'auraBlue', 'auraRed', 'auraGreen', 'auraPurple']

    const createDebugPt = (pt: Point, n: number) => {
      const d = this.pool.spawn('debug', pt)
      this.pool.attach(d, this.pool.C.sprite(this.pool.sprites, { base: [symbols[n % 5]] }))

      this.debugSymbolList.push(d)
      this.region.entityList.push(d)
    }

    if (area instanceof Point) {
      createDebugPt(area, n)
      return
    }

    area.traverse(pt => {
      createDebugPt(pt, n)
    })
  }

  debugCN(
    area: Point | Rect,
    n: number,
    color: 'transparent' | number = 'transparent',
    bgColor: 'transparent' | number = 'transparent'
  ) {
    if (area instanceof Rect) {
      area.traverse(pt => this.debugCN(pt, n, color, bgColor))
      return
    }

    const pt = area

    const d = this.region.create(pt, 'debugColor')
    if (!d) return

    const fg = typeof color === 'number' ? HSLToHex([color, 1, 0.5]) : color
    const bg = typeof bgColor === 'number' ? HSLToHex([bgColor, 0.5, 0.5]) : bgColor

    this.region
      .modify(d)
      .define('color', fg, bg)
      .define('sprite', this.pool.sprites, { base: [nAlpha(n)] })

    const prev = this.debugCNMap.get(pt)
    if (prev) this.region.destroyEntity(prev)
    this.debugCNMap.set(pt, d)
  }

  finalize() {
    this.snap('Complete')

    this.region.visualizer = new Visualizer(this.region, this.history)
    this.timeEnd = Date.now()
    console.log(`O3: ${this.timeEnd - this.timeStart}ms`, this)
  }
}

declare global {
  interface Window {
    O3Debug: Overseer3
  }
}

function nAlpha(n: number) {
  if (n < 0) return '?'
  if (n > 35) return '!'
  const map = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return map[n]
}
