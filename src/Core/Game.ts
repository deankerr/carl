// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

// import { CONFIG } from './config'

import * as ROT from 'rot-js'

import { State } from './State'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { mouseClick } from '../util/display'
import { Keys } from '../util/Keys'
import { input } from './Input'

import { UpdateFOV } from '../System/UpdateFOV'
import { PtS } from '../Model/Point'
import { handleMovement } from '../System/HandleMovement'
import { actionName, ActionTypes, __randomMove, __wait } from '../Action'
import { CONFIG } from '../config'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: State
  world: World

  lightsOn = false // reveal level debug flag

  constructor(d: ROT.Display) {
    console.log('new Game2')
    this.display = d

    this.state = new State()
    this.world = new World(this.state)

    // mouse click coords
    mouseClick(d, (event) => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1] + CONFIG.marginTop}`)
    })

    this.render()

    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    console.group('=== update === code:', code)
    const world = this.world

    const playerAction = input(code)
    if (!playerAction) {
      console.warn('null action')
      console.groupEnd()
      return
    }
    console.log('playerAction:', playerAction)

    // UI only
    if ('ui' in playerAction) {
      switch (playerAction.ui) {
        case 'toggleLightSwitch':
          this.lightsOn = !this.lightsOn
          console.log('UI: toggleLightSwitch:', this.lightsOn)
          break
        default:
          console.log('UI: Action not implemented', playerAction)
      }

      this.render()
      console.groupEnd()
      return
    }

    // debug: all entities do this action
    const __defaultActions = { wander: __randomMove, wait: __wait }
    const __defaultAction = __defaultActions.wander

    // Run systems on each entity until it's the player's turn again
    let playerTurn = true
    do {
      this.system(playerTurn ? playerAction : __defaultAction())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    console.log('update complete')
    console.groupEnd()
    this.render()
  }

  system(action: ActionTypes) {
    const { world, state } = this
    state.updateAction(action)
    console.groupCollapsed('System', world.get('tagCurrentTurn')[0].id, actionName(action))

    handleMovement(world)
    UpdateFOV(world)

    console.groupEnd()
    state.updateAction(null)
  }

  // TODO make independent of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    const d = this.display
    const top = CONFIG.marginTop

    d.clear()

    // terrain
    const level = this.state.current.level
    const { terrain } = level
    const isInternalWall = level.isInternalWall.bind(level)
    const player = this.world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]

    terrain.each((x, y, t) => {
      // TODO TerrainDict function, return default results for unknown?
      // ? maybe we should just crash

      // skip rendering if this is a wall surrounded by other walls
      // currently only to make lightsOn view look nicer
      if (this.lightsOn && isInternalWall(x, y)) return

      const here = PtS(x, y)
      // currently visible by player
      if (player.fov.visible.includes(here)) {
        const { char, color } = TerrainDictionary[t]?.console ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      } else if (player.seen.visible.includes(here) || this.lightsOn) {
        // seen previously
        const { char, color } = TerrainDictionary[t]?.consoleSeen ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      }
    })

    // entities
    const entities = this.world.get('render', 'position')

    for (const { render, position } of entities) {
      const here = PtS(position.x, position.y)
      if (player.fov.visible.includes(here) || this.lightsOn) {
        this.display.draw(position.x, top + position.y, render.char, render.color, null)
      }
    }

    // player again
    this.display.draw(player.position.x, top + player.position.y, player.render.char, 'white', null)
  }
}
