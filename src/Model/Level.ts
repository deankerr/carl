// Represents a game level
import * as ROT from 'rot-js'
import { Grid } from './Grid'
import { Entity } from '../Core/Entity'
import { Point } from './Point'
import { TerrainType, TerrainNumMap, Terrain } from '../Core/Terrain'
import { pick } from '../util/util'

export class Level {
  readonly width: number
  readonly height: number

  areaKnown: string[] = []
  voidAreaKnown: string[] = []

  readonly scheduler = new ROT.Scheduler.Simple()
  entities: Entity[] = []

  constructor(
    readonly label: string,

    readonly terrainGrid: Grid<number>,
    readonly voidDecor: Map<string, TerrainType>,
    readonly rooms: Point[][]
  ) {
    this.width = terrainGrid.width
    this.height = terrainGrid.height
  }

  terrain(at: Point): TerrainType {
    const t = this.terrainGrid.get(at)

    if (!t) return Terrain.endlessVoid
    return TerrainNumMap[t]
  }

  ptInRoom(index: number) {
    return pick(this.rooms[index])
  }
}
