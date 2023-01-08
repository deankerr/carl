// Represents a game level
import * as ROT from 'rot-js'
import { Grid } from './Grid'
import { Entity } from '../Core/Entity'
import { bigRoom, dungeon4, prefabRuin1 } from '../Generate'
import { Dungeon4Data, Room } from '../Generate/dungeon4/dungeon4'
import { TerrainDictionary } from '../Core/Terrain'
import { Point, Pt } from './Point'

// pointless duplication unless I decide I want to build levels outside of Level
export type LevelData = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
  doors?: Point[]
}

export class Level {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
  doors?: Point[]
  width: number
  height: number
  constructor(levelData: LevelData) {
    this.label = levelData.label
    this.entities = levelData.entities
    this.terrain = levelData.terrain
    this.rooms = levelData.rooms
    this.doors = levelData.doors ? levelData.doors : undefined

    this.width = this.terrain.width
    this.height = this.terrain.height
  }

  isTransparent(x: number, y: number) {
    const t = this.terrain.get(Pt(x, y))
    if (t === null) return false
    return TerrainDictionary[t].transparent
  }

  ptInRoom(index: number) {
    const rect = this.rooms[index].rect
    return Pt(ROT.RNG.getUniformInt(rect.x, rect.x2), ROT.RNG.getUniformInt(rect.y, rect.y2))
  }

  isInternalWall(pt: Point) {
    const terrain = this.terrain
    const neigh = [Pt(-1, -1), Pt(0, -1), Pt(1, -1), Pt(-1, 0), Pt(1, 0), Pt(-1, 1), Pt(0, 1), Pt(1, 1)]
    // apply neigh coords to current, return true if its another wall, false otherwise (not internal)
    const result = neigh.every(n => {
      const t = terrain.get(Pt(pt.x + n.x, pt.y + n.y))
      if (t === null) return true
      return t === 1 || t === 2 ? true : false
    })

    return result
  }

  static createDungeon4(loadLevel?: Dungeon4Data) {
    const { terrain, rooms, doors } = dungeon4(loadLevel)
    return new Level({ label: 'initialLevel', entities: [], terrain, rooms, doors })
  }

  static createRuin1() {
    return new Level(prefabRuin1())
  }

  static createBigRoom() {
    return new Level(bigRoom())
  }

  // ? static create(generator: Function) { levelData = generator() }
}
