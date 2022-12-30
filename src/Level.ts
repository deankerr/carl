// Probably will still want this for level helper methods
import { Grid } from './Core/Grid'
import { Entity } from './Components'
import { dungeon4 } from './Generate'
import { Room } from './Generate/dungeon4/dungeon4'
import { TerrainDictionary } from './Terrain'

// pointless duplication unless I decide I want to build levels outside of Level
export type LevelData = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
}

export class Level {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  rooms: Room[]
  constructor(levelData: LevelData) {
    this.label = levelData.label
    this.entities = levelData.entities
    this.terrain = levelData.terrain
    this.rooms = levelData.rooms
  }

  // TODO bounds
  isTransparent(x: number, y: number) {
    const t = this.terrain.get(x, y)
    if (t === null) return false
    return TerrainDictionary[t].transparent
  }

  ptInRoom(index: number) {
    const pt = this.rooms[index].rect.rndPt()
    return pt
  }

  static createInitial() {
    const { terrain, rooms } = dungeon4()
    return new Level({ label: 'initialLevel', entities: [], terrain, rooms })
  }

  // ? static create(generator: Function) { levelData = generator() }
}
