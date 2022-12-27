// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

// import { CONFIG } from './config'
import * as ROT from 'rot-js'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { State } from './State'
import { initialState } from './Generate/initial'
import * as C from './Components'

export class Game {
  display: ROT.Display
  world: World
  state

  constructor(d: ROT.Display) {
    console.log('new Game2')
    this.display = d

    this.state = new State(initialState())
    this.world = new World(this.state)

    this.render()
  }

  render() {
    // terrain
    const terrain = this.state.__state.level.terrain
    const top = 2
    terrain.each((x, y, t) => {
      const { char, color } = TerrainDictionary[t].console
      this.display.draw(x, top + y, char, color, null)
    })

    // render
    const allEntities = this.state.__state.activeLevel.entities
    const rEnt = allEntities.filter((e) => e.components.ConsoleRender && e.components.Position)

    rEnt.forEach((e) => {
      const { x, y } = e.components.Position as C.Position
      const { char, color } = e.components.ConsoleRender as C.ConsoleRender
      this.display.draw(x, y, char, color, null)
    })
  }
}
