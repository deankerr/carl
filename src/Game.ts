// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

// import { CONFIG } from './config'

import * as ROT from 'rot-js'

import { State } from './State'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { mouseClick } from './util/display'

export class Game {
  display: ROT.Display
  world: World
  state

  constructor(d: ROT.Display) {
    console.log('new Game2')
    this.display = d

    this.state = new State()
    this.world = new World(this.state)

    // mouse click coords
    mouseClick(d, (event) => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1] + 2}`)
    })

    this.render()
  }

  // TODO make independant of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    // terrain
    const terrain = this.state.current.activeLevel.terrain

    const top = 2
    console.log('terrain:', terrain)
    console.log('private:', this.state.__state.activeLevel.terrain)

    terrain.each((x, y, t) => {
      const { char, color } = TerrainDictionary[t].console
      this.display.draw(x, top + y, char, color, null)
    })

    // entities
    const entities = this.world.get('render', 'position')

    for (const { render, position } of entities) {
      this.display.draw(position.x, top + position.y, render.char, render.color, null)
    }

    // player again
    const player = this.world.get('tagPlayer', 'position', 'render')
    this.display.draw(player[0].position.x, top + player[0].position.y, player[0].render.char, 'white', null)
  }
}
