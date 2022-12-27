import { Level } from './Level'
import * as Generate from './Generate/'

export class World {
  levels: Level[] //Level[]
  active: Level // Level

  constructor() {
    console.log('new World')

    // get level
    const terrainGrid = Generate.Dungeon4()

    const level = new Level(terrainGrid)
    this.active = level
    this.levels = [level]

    console.log('level', level)
  }
}
