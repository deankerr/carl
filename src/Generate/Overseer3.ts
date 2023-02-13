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
  wall: Extract<EntityKey, 'dungeonWall' | 'caveWall' | 'cryptWall' | 'pitWall'>
  floor: Extract<EntityKey, 'dirtFloor' | 'stoneFloor'>
  door: Extract<EntityKey, 'woodenDoor' | 'stoneDoor' | 'jailDoor' | 'redDoor'>
}

export class Overseer3 {
  rect: Rect
  pool = window.game.pool

  timeStart = Date.now()
  timeEnd = 0

  history: Snapshot[] = []

  theme: RegionTheme = {
    wall: 'dungeonWall',
    floor: 'dirtFloor',
    door: 'woodenDoor',
  }

  constructor(readonly region: Region) {
    this.rect = region.rect
    this.snap('Init')
  }

  snap(message = '') {
    this.history.push(createSnapshot(this.region.terrainMap, this.region.entityList, message))
  }

  finalize() {
    this.snap('Complete')

    this.region.visualizer = new Visualizer(this.region, this.history)
    console.log(this)
    this.timeEnd = Date.now()
  }
}
