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

  constructor(readonly region: Region, readonly theme: RegionTheme) {
    this.rect = region.rect
    this.snap('Init')
  }

  snap(message = '') {
    this.region.evaluateTerrainVariants()
    this.history.push(createSnapshot(this.region.terrainMap, this.region.entityList, message))
  }

  finalize() {
    this.snap('Complete')

    this.region.visualizer = new Visualizer(this.region, this.history)
    this.timeEnd = Date.now()
    console.log(`O3: ${this.timeEnd - this.timeStart}ms`, this)
  }

  wall(pt: Point) {
    if (!this.region.terrainAt(pt).wall) {
      this.region.create(pt, this.theme.wall)
    }
  }

  floor(pt: Point) {
    if (!this.region.terrainAt(pt).floor) this.region.create(pt, this.theme.floor)
  }

  door(pt: Point) {
    if (this.region.at(pt).filter(e => e.door).length === 0) this.region.create(pt, this.theme.door)
  }
}
