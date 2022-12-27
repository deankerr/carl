// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

// World - contains all data about the game world. Global entities/
// info. ECS root. Container for all Levels

// Level - a single level. terrain data. Tracks entities on level.

// import { CONFIG } from './config'
import * as ROT from 'rot-js'
import { World } from './World'
import { TerrainDictionary } from './Terrain'

export class Game {
  display: ROT.Display
  world: World

  constructor(d: ROT.Display) {
    console.log('new Game2')
    this.display = d
    this.world = new World()

    this.render()
  }

  render() {
    const top = 2
    this.world.active.terrainMap.each((x, y, t) => {
      const { char, color } = TerrainDictionary[t].console
      this.display.draw(x, top + y, char, color, null)
    })
  }
}
