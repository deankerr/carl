// Represents a game level
import * as ROT from 'rot-js'
import { Grid } from './Grid'
import { Entity } from '../Core/Entity'
import { Point } from './Point'
import { Terrain, TerrainLegacyMap } from '../Core/Terrain'
import { pick, repeatUntil } from '../lib/util'
import { Color } from 'rot-js/lib/color'

export class Level {
  readonly width: number
  readonly height: number

  areaKnown: string[] = []
  voidAreaKnown: string[] = []

  readonly scheduler = new ROT.Scheduler.Simple()
  entities: Entity[] = []

  stairsDescendingPt: Point | undefined
  stairsAscendingPt: Point | undefined

  lighting = new Map<string, Color>()

  constructor(
    // bare level defaults as workaround until refactor
    readonly label = 'bare',

    readonly terrainGrid = Grid.fill(1, 1, 0),
    readonly voidDecor = new Map<string, Entity>(),
    readonly rooms: Point[][] = []
  ) {
    this.width = terrainGrid.width
    this.height = terrainGrid.height
  }

  terrain(at: Point) {
    const t = this.terrainGrid.get(at)

    if (t === null) return Terrain.endlessVoid
    return TerrainLegacyMap[t]
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
        repeatUntil(() => {
          const pt = this.terrainGrid.rndPt()
          if (!this.terrain(pt).tagWalkable) return false
          result = pt
          return true
        }, 1000)
        if (!result) throw new Error('Could find random walkable in level')
        return result
      }
    }
    return pick(this.rooms[index])
  }
}
