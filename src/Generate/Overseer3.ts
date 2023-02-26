import * as ROT from 'rot-js'
import { Entity, EntityKey, EntityPool, Region } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import { heatMapColor } from '../lib/color'
import { point, Point } from '../lib/Shape/Point'
import { Rect } from '../lib/Shape/Rectangle'
import { nAlpha, rnd } from '../lib/util'

export type Snapshot = {
  terrainMap: Map<Point, Entity>
  debugSymbolMap: Map<Point, [string, string, string]>
  entityList: Entity[]
  message: string
  ghostMap: Map<Point, EntityKey[]>
}

export type RegionTheme = {
  wall: EntityKey
  floor: EntityKey
  door: EntityKey
  stairsUp: EntityKey
  stairsDown: EntityKey
}

export class Overseer3 {
  rect: Rect
  pool: EntityPool

  timeStart = Date.now()
  timeEnd = 0

  history: Snapshot[] = []

  theme: RegionTheme

  ghostMap = new Map<Point, EntityKey[]>()

  constructor(readonly region: Region, theme: ThemeKey = 'dungeon') {
    this.rect = region.rect
    this.pool = region.pool
    this.theme = this.createTheme(theme)
    console.log(
      `%c  O3: ${region.name} - Theme: ${theme}, Area: ${region.width * region.height} `,
      'font-weight: bold; background-color: orange;'
    )
  }

  snap(message = '') {
    this.history.push({
      terrainMap: new Map([...this.region.terrainMap]),
      debugSymbolMap: new Map([...this.region.debugSymbolMap]),
      entityList: [...this.region.entityList],
      message: message,
      ghostMap: this.ghostMap,
    })
    this.ghostMap = new Map<Point, EntityKey[]>()
  }

  wall(pt: Point) {
    if (!this.region.terrainAt(pt).wall) {
      this.region.create(pt, this.theme.wall)
    }
  }

  floor(area: Point | Point[] | Rect) {
    if (area instanceof Rect) [...area.each()].forEach(pt => this.floor(pt))
    else if (Array.isArray(area)) area.forEach(pt => this.floor(pt))
    else {
      if (!this.region.terrainAt(area).floor) this.region.create(area, this.theme.floor)
    }
  }

  door(pt: Point) {
    if (this.region.at(pt).filter(e => e.door).length === 0) this.region.create(pt, this.theme.door)
  }

  stairsUp(pt: Point) {
    this.region.create(pt, this.theme.stairsUp)
  }

  stairsDown(pt: Point) {
    this.region.create(pt, this.theme.stairsDown)
  }

  room(rect: Rect) {
    rect.traverse((pt, edge) => {
      edge ? this.wall(pt) : this.floor(pt)
    })
  }

  add(area: Point | Point[] | Rect, key: EntityKey) {
    if (area instanceof Rect) [...area.each()].forEach(pt => this.add(pt, key))
    else if (Array.isArray(area)) area.forEach(pt => this.add(pt, key))
    else {
      const pt = area
      if (key === 'wall') this.wall(pt)
      else if (key === 'floor') this.floor(pt)
      else if (key === 'stairsDown') this.stairsDown(pt)
      else if (key === 'stairsUp') this.stairsUp(pt)
      else this.region.create(area, key)
    }
  }

  addGhost(pt: Point, keys: EntityKey[]) {
    this.ghostMap.set(pt, keys)
  }

  addObjectGhost(map: Map<Point, EntityKey[]>, filter: Extract<EntityKey, 'fogRed' | 'fogGreen'>) {
    for (const [pt, keys] of map) {
      this.ghostMap.set(pt, [...keys, filter])
    }
  }

  addObjectRevertible(map: Map<Point, EntityKey[]>) {
    const revertTerrain = new Map<Point, Entity>()
    const revertEntities: Entity[] = []

    for (const [pt, keys] of map) {
      const currentTerrain = this.region.terrainAt(pt)
      for (const key of keys) {
        const newEntity = this.region.create(pt, this.themed(key))
        if (!newEntity) continue
        if (newEntity.terrain) revertTerrain.set(pt, currentTerrain)
        revertEntities.push(newEntity)
      }
    }

    return { revertTerrain, revertEntities }
  }

  revertObject(revert: { revertTerrain: Map<Point, Entity>; revertEntities: Entity[] }) {
    const { revertTerrain, revertEntities } = revert
    for (const [pt, Entity] of revertTerrain) this.region.terrainMap.set(pt, Entity)
    revertEntities.forEach(e => this.region.destroy(e))
  }

  clear(area: Point | Rect) {
    if (area instanceof Rect) [...area.each()].forEach(pt => this.clear(pt))
    else {
      const [_terrain, ...entities] = this.region.at(area)
      entities.forEach(e => {
        if (e.key !== 'shadow') this.region.destroy(e)
      })
    }
  }

  path(pt1: Point, pt2: Point, key: EntityKey, customPassFn?: (x: number, y: number) => boolean) {
    const passFn = customPassFn?.bind(this.region) ?? this.region.ROTisPassable.bind(this.region)
    const pathFn = new ROT.Path.AStar(pt2.x, pt2.y, passFn, { topology: rnd(2) ? 8 : 4 })
    pathFn.compute(pt1.x, pt1.y, (x, y) => {
      const pPt = point(x, y)
      this.clear(pPt)
      this.add(pPt, key)
    })
  }

  building(pt: Point, sign?: 'blank' | 'weapon' | 'potion' | 'inn') {
    this.clear(Rect.atC(pt, 5, 4))
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

  debug(
    pt: Point | Point[] | Rect,
    tile: string | number,
    color: number | string = 'transparent',
    bgColor = 'transparent'
  ) {
    if (pt instanceof Rect) {
      pt.traverse(pti => this.debug(pti, tile, color, bgColor))
      return
    }

    if (Array.isArray(pt)) {
      pt.forEach(pt2 => this.debug(pt2, tile, color, bgColor))
      return
    }

    if (typeof tile === 'number') tile = nAlpha(tile)
    if (typeof color === 'number') color = heatMapColor(color)

    this.region.debugSymbolMap.set(pt, [tile, color, bgColor])
  }

  clearDebug(at?: Point | Point[]) {
    if (!at) {
      this.region.debugSymbolMap.clear()
      return
    }
    if (Array.isArray(at)) {
      for (const pt of at) this.region.debugSymbolMap.delete(pt)
    } else this.region.debugSymbolMap.delete(at)
  }

  finalize() {
    const { region, history } = this
    this.snap('Complete')

    region.visualizer = new Visualizer(region, history)
    this.region.heatMap.initialize(region.walkable())

    this.timeEnd = Date.now()
    console.log(`O3: ${this.timeEnd - this.timeStart}ms`, this)
  }

  createTheme(wall: ThemeKey, floor?: EntityKey, door: EntityKey = 'woodenDoor'): RegionTheme {
    const themes: Record<ThemeKey, EntityKey[]> = {
      dungeon: ['dungeonWall', 'stoneFloor', 'dungeonStairsUp', 'dungeonStairsDown'],
      crypt: ['cryptWall', 'stoneTileFloor', 'cryptStairsUp', 'cryptStairsDown'],
      cave: ['caveWall', 'dirtFloor', 'caveStairsUp', 'caveStairsDown'],
      cavern: ['cavernWall', 'dirtFloor', 'cavernStairsUp', 'cavernStairsDown'],
    }

    return {
      wall: themes[wall][0],
      floor: floor ?? themes[wall][1],
      door,
      stairsUp: themes[wall][2],
      stairsDown: themes[wall][3],
    }
  }

  themed(key: EntityKey) {
    if (key === 'wall') return this.theme.wall
    if (key === 'floor') return this.theme.floor
    if (key === 'stairsUp') return this.theme.stairsUp
    if (key === 'stairsDown') return this.theme.stairsDown
    if (key === 'door') return this.theme.door
    return key
  }
}

type ThemeKey = 'dungeon' | 'crypt' | 'cave' | 'cavern'

// ! dev
declare global {
  interface Window {
    O3Debug: Overseer3
  }
}
