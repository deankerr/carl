// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

import { CONFIG } from '../config'
import * as ROT from 'rot-js'

import { World } from './World'
import { renderLevel, renderMessages } from './Render'

import { acting } from '../Component'
import { handleBump, processDeath, handleMovement, processFOV, handleMeleeAttack } from '../System'
import { actionName, ActionTypes, __randomMove, __wait } from '../Action'

import { Keys } from '../lib/Keys'
import { input } from './Input'

import { handleTread } from '../System/handleTread'

export class Game {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()
  world: World

  messageNew: string[] = [] // messages generated during the last update
  messageHistory: string[] = [] // previous messages that still fit in the buffer visually

  options = {
    lightsOn: CONFIG.lightsOnInitial, // reveal level debug flag
    hideInternalWalls: true,
    showCanvasDebug: false,
    debugMode: false,
  }

  constructor(d: ROT.Display, msg: ROT.Display) {
    this.display = d
    this.msgDisplay = msg
    const seed = ROT.RNG.getSeed()
    console.log('CARL! seed:', seed)

    this.world = new World(this.options)

    // set up first turn
    this.world.nextTurn() // set the currentTurn
    processFOV(this.world)

    this.world.__clog(true)

    this.render()

    // game active
    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    const timeUpdate = Date.now()

    const playerAction = input(code)
    if (!playerAction) return

    const { playerTurns } = this.world
    const world = this.world
    console.groupCollapsed(`# update # key: '${code}', turn: '${playerTurns}'`)

    console.log('playerAction:', playerAction)

    // UI only
    if ('ui' in playerAction) {
      console.groupEnd()
      switch (playerAction.ui) {
        case 'toggleLightSwitch':
          this.options.lightsOn = !this.options.lightsOn
          console.log('UI: toggleLightSwitch:', this.options.lightsOn)
          break
        case 'toggleInternalWalls':
          this.options.hideInternalWalls = !this.options.hideInternalWalls
          break
        case 'render':
          // this.options.showDisplayDebug = true
          this.options.debugMode = !this.options.debugMode
          this.render()
          console.log('UI: render')
          break
        case 'debug_logworld':
          this.world.__clog()
          return
        default:
          console.log('UI: Action not implemented', playerAction)
      }

      this.render()
      // console.groupEnd()
      return
    }

    // * change level *
    if ('changeLevel' in playerAction) {
      console.groupEnd()

      // debug
      if (playerAction.changeLevel.to.startsWith('debug_')) {
        console.log(playerAction.changeLevel.to)
        if (playerAction.changeLevel.to === 'debug_down') world.changeLevel(1)
        if (playerAction.changeLevel.to === 'debug_up') world.changeLevel(-1)
        if (playerAction.changeLevel.to === 'debug_outdoor') world.setCurrentLevel(world.domainMap['outdoor'], 0)
        if (playerAction.changeLevel.to === 'debug_dungeon') world.setCurrentLevel(world.domainMap['dungeon'], 0)
        world.nextTurn()
        processFOV(world)
        this.render()

        return
      }

      // actual
      const [player] = this.world.get('tagPlayer', 'position')
      const [terrain] = this.world.here(player.position)
      if (terrain?.description?.name === 'descending stairs') {
        world.changeLevel(1)
      } else if (terrain?.description?.name === 'ascending stairs') {
        world.changeLevel(-1)
      } else console.warn('Not on stairs')

      world.nextTurn()
      processFOV(world)
      this.render()

      return
    }

    // * temp: all npc entities do this action
    const __defaultActions = { wander: __randomMove, wait: __wait }
    const __defaultAction = __defaultActions.wander

    // Run systems on each entity until it's the player's turn again
    let playerTurn = true
    this.world.playerTurns++
    let infiniteLoop = 0
    do {
      if (infiniteLoop++ > 200) throw new Error('System loop exceeded limit')
      this.system(playerTurn ? playerAction : __defaultAction())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    console.log(`# update complete # ${Date.now() - timeUpdate}ms`)
    console.groupEnd()

    this.render()
  }

  system(action: ActionTypes) {
    const { world } = this
    const [entity] = world.get('tagCurrentTurn')

    if (!entity) throw new Error('system: no tagCurrentTurn entity')

    world.modify(entity).add(acting(action))
    console.groupCollapsed(`System: '${entity.id}' -> '${actionName(action)}'`)

    handleMovement(world)
    handleTread(world)
    handleBump(world)
    handleMeleeAttack(world)
    processDeath(world)
    processFOV(world)
    // handleLevelTransition?

    const [entityDone] = world.get('tagCurrentTurn')
    world.modify(entityDone).remove('acting')

    console.groupEnd()
    // this.render()
  }

  render() {
    renderMessages(this.msgDisplay, this.world, this.options)
    renderLevel(this.display, this.world, this.options)
  }
}
