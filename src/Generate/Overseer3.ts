import { Entity, EntityKey, Region } from '../Core'
import { Visualizer } from '../Core/Visualizer'
import { Point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

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

type RegionTheme = {
  wall: Extract<EntityKey, 'dungeonWall' | 'caveWall' | 'cryptWall' | 'cavernWall'>
  floor: Extract<EntityKey, 'dirtFloor' | 'stoneFloor' | 'stoneTileFloor'>
  door: Extract<EntityKey, 'woodenDoor' | 'stoneDoor' | 'jailDoor' | 'redDoor'>
}

export class Overseer3 {
  rect: Rect
  pool = window.game.pool

  timeStart = Date.now()
  timeEnd = 0

  history: Snapshot[] = []

  theme: RegionTheme = { wall: 'dungeonWall', floor: 'dirtFloor', door: 'woodenDoor' }

  constructor(readonly region: Region) {
    this.rect = region.rect
    this.snap('Init')
    console.log(`%c  O3: ${region.name}  `, 'font-weight: bold; background-color: orange;')
  }

  snap(message = '') {
    this.region.evaluateTerrainVariants()
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

  room(rect: Rect, debug = false) {
    rect.traverse((pt, edge) => {
      edge ? this.wall(pt) : this.floor(pt)
    })
    if (debug) {
      const d = this.pool.spawn('debug', rect.centerPoint())
      d.render = { ...d.render, char: `${debugChar[rect.id]}` }
      this.region.entityList.push(d)
    }
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

  debug(area: Point | Rect) {
    const pt = area instanceof Rect ? area.centerPoint() : area
    const d = this.pool.spawn('debug', pt)
    const char = debugChar.shift() ?? '?'
    d.render = { ...d.render, char }
    this.region.entityList.push(d)
  }

  finalize() {
    this.snap('Complete')

    this.region.visualizer = new Visualizer(this.region, this.history)
    this.timeEnd = Date.now()
    console.log(`O3: ${this.timeEnd - this.timeStart}ms`, this)
  }
}

const debugChar = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=+.,:;"<>/|'.split('')
