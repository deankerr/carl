// Probably will still want this for level helper methods
import { Grid } from './Core/Grid'
import { Entity } from './Components'
import { dungeon4 } from './Generate'
import { Room } from './Generate/dungeon4/dungeon4'
import { TerrainDictionary } from './Terrain'
import { Pt } from './Core/Point'

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

  isTransparent(x: number, y: number) {
    const t = this.terrain.get(x, y)
    if (t === null) return false
    return TerrainDictionary[t].transparent
  }

  ptInRoom(index: number) {
    const pt = this.rooms[index].rect.rndPt()
    return pt
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

  static createInitial() {
    const { terrain, rooms } = dungeon4()
    return new Level({ label: 'initialLevel', entities: [], terrain, rooms })
  }

  // ? static create(generator: Function) { levelData = generator() }
}
