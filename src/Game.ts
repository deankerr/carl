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
import { UpdateFOV } from './Systems/UpdateFOV'
import { PtS } from './Core/Point'

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

    this.update('x')

    this.keys.add(this.update.bind(this))

    this.world.nextTurn()
  }

  update(code: string) {
    console.log('=== update === code:', code)

    // currently assuming we start the loop on the player's turn
    const action = input(code)
    if (!action) {
      console.warn('null action')
      return
    }

    console.log('Action:', action)

    // temp
    // use ID? makes passing through entity easier
    // or attach currentTurn component, integrates with current system
    handlePlayer(this.world, action)
    UpdateFOV(this.world)

    this.render()
  }

  /*
  update() {

    do {
      const next = this.world.nextTurn()
      if (next == player) break? generator function? how do we jump back in
      playerAction || getAction()
       Move(action)
      UpdateFOV(this.world)

    } while (1)


    do {
      Move(action)
      UpdateFOV()
      render()
      nextTurn()
      if (next == player) break
      GetAIAction()
    } while (1)
  }
*/

  // TODO make independent of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    // terrain
    const terrain = this.state.current.level.terrain

    const top = 2
    // console.log('terrain:', terrain)
    // console.log('private:', this.state.__state.activeLevel.terrain)

    terrain.set(0, 0, 3) // TODO shouldn't work on Readonly current

    const player = this.world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]

    terrain.each((x, y, t) => {
      // TODO TerrainDict function, return default results for unknown?
      // ? maybe we should just crash
      const here = PtS(x, y)
      // currently visible by player
      if (player.fov.visible.includes(here)) {
        const { char, color } = TerrainDictionary[t]?.console ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      } else if (player.seen.visible.includes(here)) {
        // seen previously
        const { char, color } = TerrainDictionary[t]?.consoleSeen ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      }
    })

    // entities
    const entities = this.world.get('render', 'position')

    for (const { render, position } of entities) {
      this.display.draw(position.x, top + position.y, render.char, render.color, null)
    }

    // player again
    // const player = this.world.get('tagPlayer', 'position', 'render')
    this.display.draw(player.position.x, top + player.position.y, player.render.char, 'white', null)
  }
}
