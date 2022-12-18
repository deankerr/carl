import { Dungeon2 } from './generate/Dungeon2'
import { Dungeon2v2 } from './generate/Dungeon2v2'
import { Visualizer } from './generate/Visualizer'

export class World {
  // config
  defaultLevelGen = 'dungeon2'

  // fields
  // ? Level data type?
  activeLevel: string[] = []

  // TEMP?
  activeLevelGenerator: Dungeon2 | Dungeon2v2 | null = null

  constructor() {
    console.log('new World')
    // TODO ?????
  }

  // Generate a level
  // ? leveltype: LevelType?
  // ? config object?
  createLevel(
    levelWidth: number,
    levelHeight: number,
    levelType = this.defaultLevelGen,
    visualizer: Visualizer | null = null
  ) {
    console.log('World.createLevel()')

    // TODO handle multiple levels
    switch (levelType) {
      case 'dungeon2':
        this.activeLevelGenerator = new Dungeon2(levelWidth, levelHeight, visualizer)
        break
      case 'dungeon2v2':
        this.activeLevelGenerator = new Dungeon2v2(levelWidth, levelHeight, visualizer)
        break
    }

    // create
    if (this.activeLevelGenerator) {
      this.activeLevelGenerator.create()
      // console.log('Final visual')
      // this.activeLevelGenerator.visual()
    } else console.log('No active level to create()')
  }
}
