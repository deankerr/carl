// Probably will still want this for level helper methods
import { Grid } from './Core/Grid'
import { Entity } from './Components'
import { dungeon4 } from './Generate'

// pointless duplication unless I decide I want to build levels outside of Level
export type LevelData = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
}

export class Level {
  label: string
  entities: Entity[]
  terrain: Grid<number>
  constructor(levelData: LevelData) {
    this.label = levelData.label
    this.entities = levelData.entities
    this.terrain = levelData.terrain
  }

  static createInitial() {
    return new Level({ label: 'initialLevel', entities: [], terrain: dungeon4() })
  }

  // ? static create(generator: Function) { levelData = generator() }
}
