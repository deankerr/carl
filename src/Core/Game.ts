// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

import { CONFIG } from '../config'
import * as ROT from 'rot-js'

import { createState, StateObject } from './State'
import { World } from './World'
import { renderLevel } from './Render'

import { acting } from '../Component'
import { handleBump, processDeath, handleMovement, processFOV, handleMeleeAttack } from '../System'
import { actionName, ActionTypes, __randomMove, __wait } from '../Action'

import { mouseClick } from '../util/display'
import { Keys } from '../util/Keys'
import { objLog } from '../util/util'
import { input } from './Input'

import { handleTread } from '../System/handleTread'

import * as Generate from '../Generate'
import { Level } from '../Model/Level'
import { NewLevelWithEntities } from '../Generate'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: StateObject
  world: World

  messageNew: string[] = [] // messages generated during the last update
  messageHistory: string[] = [] // previous messages that still fit in the buffer visually

  options = {
    lightsOn: CONFIG.lightsOnInitial, // reveal level debug flag
    hideInternalWalls: true,
    showCanvasDebug: false,
    debugMode: false,
  }

  constructor(d: ROT.Display) {
    console.log('new Game2')
    this.display = d
    const seed = ROT.RNG.getSeed()
    console.log('seed:', seed)

    // initial level
    let initialLevelEntities: NewLevelWithEntities
    switch (CONFIG.initialLevel) {
      // case 'ruins1':
      //   initialLevel = Generate.prefabRuin1()
      //   break
      case 'dungeon4':
      default:
        initialLevelEntities = Generate.dungeon4()
    }
    const [level, entityTemplates] = initialLevelEntities

    this.state = createState(level)
    this.world = new World(this.state, this.options)
    this.world.createTemplates(entityTemplates)
    this.world.createPlayer()

    // mouse click coords
    mouseClick(d, event => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1] + CONFIG.topPanelSize}`)
    })

    // set up first turn
    this.processMessages()
    this.world.nextTurn() // set the currentTurn
    processFOV(this.world)

    objLog(this.state, 'Initial state')

    this.render()

    // game active
    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    const timeUpdate = Date.now()
    const { playerTurns } = this.state
    console.groupCollapsed(`# update # key: '${code}', turn: '${playerTurns}'`)
    const world = this.world

    const playerAction = input(code)
    if (!playerAction) {
      console.log('null action')
      console.groupEnd()
      return
    }
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
      objLog(this.state, 'Change level')
      this.changeLevel(playerAction.changeLevel.to)

      processFOV(this.world)
      this.render()
      // console.groupEnd()
      return
    }

    // * temp: all npc entities do this action
    const __defaultActions = { wander: __randomMove, wait: __wait }
    const __defaultAction = __defaultActions.wander

    // Run systems on each entity until it's the player's turn again
    let playerTurn = true
    this.state.playerTurns++
    do {
      this.system(playerTurn ? playerAction : __defaultAction())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    this.processMessages()

    console.groupEnd()

    objLog(this.state, `# update complete # ${Date.now() - timeUpdate}ms`, true)

    this.render()
  }

  messages() {
    return this.messageNew.join('  ') + '%c{#777}  ' + this.messageHistory.join('  ')
  }

  processMessages() {
    const { messages, playerTurns } = this.state
    if (messages.length < 1) return

    this.messageHistory = [...this.messageNew, ...this.messageHistory]
    this.messageNew = []

    // put new messages from this turn into current
    if (messages[0][0] === playerTurns) this.messageNew = messages[0][1]

    // clip buffer height
    const maxWidth = this.display.getOptions().width
    while (ROT.Text.measure(this.messages(), maxWidth).height > CONFIG.topPanelSize + 1) {
      this.messageHistory.pop()
    }
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
    renderLevel(this.display, this.world, this.messages(), this.options)
  }

  changeLevel(to: string) {
    const { active, levels } = this.state
    const currentLevelIndex = levels.findIndex(l => l === active)
    if (currentLevelIndex === -1) throw new Error('Unable to find current level?')

    let nextIndex: number
    switch (to) {
      case 'descend':
        console.log('Change level down!')
        nextIndex = currentLevelIndex + 1
        break
      case 'ascend':
        console.log('Change level up!')
        if (currentLevelIndex === 0) {
          console.error('Cannot ascend: level index is 0')
          return
        }
        nextIndex = currentLevelIndex - 1
        break
      default:
        throw new Error('Invalid changeLevel action')
    }

    // nextLevel
    const nextLevel = levels[nextIndex]
    console.log('nextLevel?:', nextLevel)
    if (!nextLevel) {
      console.log('Generate next level for', nextIndex)
      const [newLevel, newEntities] = Generate.dungeon4()
      this.state.levels.push(newLevel)
      this.state.active = newLevel
      this.world.active = newLevel
      this.world.createTemplates(newEntities)
      this.world.createPlayer()
    } else {
      console.log('Changing level to', nextLevel.label)
      this.state.active = nextLevel
      this.world.active = nextLevel
    }

    this.world.nextTurn()
  }
}
