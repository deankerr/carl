// Represents a game level
import * as ROT from 'rot-js'
import { Grid } from './Grid'
import { Entity } from '../Core/Components'
import { dungeon4 } from '../Generate'
import { Dungeon4Data, Room } from '../Generate/dungeon4/dungeon4'
import { TerrainDictionary } from '../Core/Terrain'
import { Point, Pt } from './Point'

// pointless duplication unless I decide I want to build levels outside of Level
export type LevelData = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
  doors: Point[]
}

export class Level {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
  doors: Point[]
  constructor(levelData: LevelData) {
    this.label = levelData.label
    this.entities = levelData.entities
    this.terrain = levelData.terrain
    this.rooms = levelData.rooms
    this.doors = levelData.doors
  }

  isTransparent(x: number, y: number) {
    const t = this.terrain.get(x, y)
    if (t === null) return false
    return TerrainDictionary[t].transparent
  }

  ptInRoom(index: number) {
    const rect = this.rooms[index].rect
    return Pt(ROT.RNG.getUniformInt(rect.x, rect.x2), ROT.RNG.getUniformInt(rect.y, rect.y2))
  }

  isInternalWall(x: number, y: number) {
    const terrain = this.terrain
    const neigh = [Pt(-1, -1), Pt(0, -1), Pt(1, -1), Pt(-1, 0), Pt(1, 0), Pt(-1, 1), Pt(0, 1), Pt(1, 1)]
    // apply neigh coords to current, return true if its another wall, false otherwise (not internal)
    const result = neigh.every((n) => {
      const t = terrain.get(x + n.x, y + n.y)
      if (t === null) return true
      return t === 1 ? true : false
    })

    return result
  }

  static createInitial(loadLevel?: Dungeon4Data) {
    const { terrain, rooms, doors } = dungeon4(loadLevel)
    return new Level({ label: 'initialLevel', entities: [], terrain, rooms, doors })
  }

  // ? static create(generator: Function) { levelData = generator() }
}
