// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

import * as ROT from 'rot-js'
import { CONFIG } from '../config'

import { renderLevel, renderMessages } from './Render'
import { World } from './World'

import { actionName, ActionTypes, __randomMove, __wait } from '../Action'
import { acting } from '../Component'
import {
  handleBump,
  handleMeleeAttack,
  handleMovement,
  handleTread,
  processAnimation,
  processDeath,
  processFOV,
  processLighting,
} from '../System'

import { mouseMove } from '../lib/display'
import { Keys } from '../lib/Keys'
import { input } from './Input'
import { Pt } from '../Model/Point'
import { Visualizer } from './Visualizer'

export class Game {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()
  world: World
  context: Context = Context.Game

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

    // debug
    this.world.__clog(true)

    // mouse click coords
    mouseMove(this.display, ev => this.debugAtCursor(this.display.eventToPosition(ev)))

    processFOV(this.world)
    // game active
    this.render()
    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    const timeUpdate = Date.now()
    this.world.hasChanged = true

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
          console.log('UI: render')
          break
        case 'debug_logworld':
          this.world.__clog()
          return
        case 'visualizer':
          // Visualizer Context
          if (this.world.active.overseer.main.size > 0) {
            console.log('Game: Start Visualizer')
            this.keys.cleanup()
            new Visualizer(this.world, this.keys)
            console.log('Game: resumed')
            this.keys.add(this.update.bind(this))
          }
          return
        default:
          console.log('UI: Action not implemented', playerAction)
      }

      // this.render()
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
        if (playerAction.changeLevel.to === 'debug_testLevel') world.setCurrentLevel(world.domainMap['testLevel'], 0)

        world.nextTurn()
        processLighting(this.world)
        processFOV(this.world)
        // this.render()
        return
      }

      // actual
      const [player] = this.world.get('tagPlayer', 'position')
      const [terrain] = this.world.here(player.position)
      if (terrain.name === 'descending stairs') {
        world.changeLevel(1)
      } else if (terrain.name === 'ascending stairs') {
        world.changeLevel(-1)
      } else console.warn('Not on stairs')

      world.nextTurn()
      processLighting(this.world)
      processFOV(this.world)
      // this.render()

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

    // Once per player turn
    // processGraphicUpdate(world)
    processLighting(this.world)
    processFOV(this.world)

    console.groupEnd()
    console.log(`# update complete # ${Date.now() - timeUpdate}ms`)

    // this.render()
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

  lastFrameTime = 0
  lastFrameSec = 0
  renderOff = false
  fpsMsg = ''
  render() {
    if (this.renderOff) return
    const t = Date.now()
    const tLast = t - this.lastFrameTime
    this.lastFrameTime = t

    const sec = new Date().getSeconds()
    if (this.lastFrameSec !== sec) {
      this.lastFrameSec = sec
      this.fpsMsg = `${(1000 / tLast).toFixed(0)}`
    }

    processAnimation(this.world)
    processLighting(this.world)

    if (this.world.hasChanged) {
      renderMessages(this.msgDisplay, this.world, this.options, [this.fpsMsg + this.debugCoordMsg, this.debugColorMsg])
      renderLevel(this.display, this.world, this.options)
      this.world.hasChanged = false
    }

    // setTimeout(() => requestAnimationFrame(this.render.bind(this)), CONFIG.renderInterval)
    requestAnimationFrame(this.render.bind(this))
  }

  debugCoordMsg = ''
  debugColorMsg = ''
  debugAtCursor(cursor: number[]) {
    const pt = Pt(cursor[0], cursor[1])
    this.debugCoordMsg = ` ${pt.x},${pt.y}`

    if (CONFIG.debugShowLightInfo) {
      // color
      const [terrain] = this.world.here(pt)
      const color = ROT.Color.fromString(terrain.color)
      // lighting
      const lighting = this.world.active.lighting.get(pt.s) ?? [0, 0, 0]
      const total = ROT.Color.add(color, lighting)

      const { toRGB } = ROT.Color
      this.debugColorMsg = 'C:' + toRGB(color) + ' L:' + toRGB(lighting) + ' T:' + toRGB(total)
    }

    this.world.hasChanged = true
  }
}

const Context = {
  Game: 'Game',
  Visualizer: 'Visualizer',
} as const

type Context = keyof typeof Context
