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

import { UpdateFOV } from './Systems/UpdateFOV'
import { PtS } from './Core/Point'
import { handleMovement } from './Systems/HandleMovement'
import { ActionTypes, __randomMove } from './Actions'

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
  }

  update(code: string) {
    console.group('=== update === code:', code)
    const world = this.world

    // currently assuming we start the loop on the player's turn
    let playerTurn = true

    const action = input(code)
    if (!action) {
      console.warn('null action')
      console.groupEnd()
      return
    }
    console.log('Action:', action)

    this.system(action)
    playerTurn = world.nextTurn()

    // Other entities
    do {
      this.system(__randomMove())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    console.log('update complete')
    console.groupEnd()
    this.render()
  }

  system(action: ActionTypes) {
    const world = this.world
    console.log('System', world.get('tagCurrentTurn')[0])
    handleMovement(world, action)
    UpdateFOV(world)
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
    const d = this.display
    d.clear()
    // terrain
    const terrain = this.state.current.level.terrain

    const top = 2
    // console.log('terrain:', terrain)
    // console.log('private:', this.state.__state.activeLevel.terrain)

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
