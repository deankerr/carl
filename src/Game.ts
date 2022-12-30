// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

// import { CONFIG } from './config'

import * as ROT from 'rot-js'

import { State } from './State'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { mouseClick } from './util/display'
import { Keys } from './util/Keys'
import { input } from './Input'

import { handlePlayer } from './Systems/HandlePlayer'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: State
  world: World

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

    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    console.log('=== update === code:', code)

    const action = input(code)
    if (!action) {
      console.warn('null action')
      return
    }

    console.log('Action:', action)

    // temp
    handlePlayer(this.world, action)

    this.render()
  }

  // TODO make independent of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    // terrain
    const terrain = this.state.current.activeLevel.terrain

    const top = 2
    // console.log('terrain:', terrain)
    // console.log('private:', this.state.__state.activeLevel.terrain)

    terrain.set(0, 0, 3) // TODO shouldn't work on Readonly current

    terrain.each((x, y, t) => {
      // TODO TerrainDict function, return default results for unknown?
      // ? maybe we should just crash
      const { char, color } = TerrainDictionary[t]?.console ?? { char: t, color: 'red' }
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
