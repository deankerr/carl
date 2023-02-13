import { Entity, EntityKey, Region } from '../Core'
import { Point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'

type Snapshot = {
  terrainMap: Map<Point, Entity>
  entityList: Entity[]
  message: string
}

function createSnapshot(
  terrainMap: Map<Point, Entity>,
  entityList: Entity[],
  message = ''
): Snapshot {
  return { terrainMap, entityList, message }
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
}
