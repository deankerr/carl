// Represents a game level
import * as ROT from 'rot-js'
import { Grid } from './Grid'
import { Entity } from '../Core/Entity'
import { Point } from './Point'
import { Terrain, TerrainTemplate, GlobalTerrain } from '../Templates/Terrain'
import { pick, repeat } from '../lib/util'
import { Color } from 'rot-js/lib/color'
import { Overseer } from '../Generate/Overseer'

export class Level {
  readonly width: number
  readonly height: number

  areaKnown: string[] = []
  voidAreaKnown: string[] = []

  readonly scheduler = new ROT.Scheduler.Simple()
  entities: Entity[] = []
  lighting = new Map<string, Color>()
  overseer: Overseer = new Overseer(1, 1, Terrain.void)
  domainConnections = new Map<string, string>()

  constructor(
    // bare level defaults as workaround until refactor
    readonly label = 'bare',

    // readonly terrainGrid: Grid<number> = Grid.fill(1, 1, 0),
    public terrainGrid: Grid<TerrainTemplate>,
    readonly voidDecor = new Map<string, Entity>(),
    readonly rooms: Point[][] = []
  ) {
    this.width = terrainGrid.width
    this.height = terrainGrid.height
  }

  terrain(at: Point) {
    const template = this.terrainGrid.get(at)
    return GlobalTerrain(template ?? Terrain.endlessVoid)
  }

  ptInRoom(index?: number) {
    if (index === undefined || this.rooms[index] === undefined) {
      // choose a random room if none provided
      if (this.rooms.length > 0) {
        const room = pick(this.rooms)
        return pick(room)
      } else {
        // if they are no rooms, find any open pt
        let result
        repeat(1000, () => {
          const pt = this.terrainGrid.rndPt()
          if (!this.terrain(pt).tagWalkable) return false
          result = pt
          return true
        })
        if (!result) throw new Error('Could find random walkable in level')
        return result
      }
    }
    return pick(this.rooms[index])
  }
}

export class Level2 {
  readonly width: number
  readonly height: number
  terrain = new Map<Point, Entity>()
  entities: Entity[] = []
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }
}
