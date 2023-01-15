// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

import { CONFIG } from '../config'
import * as ROT from 'rot-js'

import { createState, StateObject } from './State'
import { World } from './World'
import { renderLevel, renderMessages2 } from './Render'

import { acting } from '../Component'
import { handleBump, processDeath, handleMovement, processFOV, handleMeleeAttack } from '../System'
import { actionName, ActionTypes, __randomMove, __wait } from '../Action'

import { mouseClick } from '../lib/display'
import { Keys } from '../lib/Keys'
import { objLog } from '../lib/util'
import { input } from './Input'

import { handleTread } from '../System/handleTread'

import * as Generate from '../Generate'

export class Game {
  display: ROT.Display
  msgDisplay: ROT.Display
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

  constructor(d: ROT.Display, msg: ROT.Display) {
    console.log('new Game2')
    this.display = d
    this.msgDisplay = msg
    const seed = ROT.RNG.getSeed()
    console.log('seed:', seed)

    // initial level
    let gen: () => Generate.NewLevel
    switch (CONFIG.initialLevel) {
      case 'outdoor':
        gen = Generate.outdoor
        break
      case 'ruins1':
        gen = Generate.prefabRuin1
        break
      case 'arena':
        gen = Generate.arena
        break
      case 'dungeon4':
      default:
        gen = Generate.dungeon4
    }
    const [level, entityTemplates] = gen()

    this.state = createState(level)
    this.world = new World(this.state, this.options)
    this.world.createTemplates(entityTemplates)
    this.world.createPlayer()

    // mouse click coords
    mouseClick(d, event => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1]}`)
    })

    // set up first turn
    this.world.nextTurn() // set the currentTurn
    processFOV(this.world)

    objLog(this.state, 'Initial state')

    this.render()

    // game active
    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    const timeUpdate = Date.now()

    const playerAction = input(code)
    if (!playerAction) return

    const { playerTurns } = this.state
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
      const [player] = this.world.get('tagPlayer', 'position')
      const [terrain] = this.world.here(player.position)
      if (terrain.title === 'descending stairs') this.changeLevel('descend')
      else if (terrain.title === 'ascending stairs') this.changeLevel('ascend')
      else console.warn('Not on stairs')
      return
    }

    // * temp: all npc entities do this action
    const __defaultActions = { wander: __randomMove, wait: __wait }
    const __defaultAction = __defaultActions.wander

    // Run systems on each entity until it's the player's turn again
    let playerTurn = true
    this.state.playerTurns++
    let infiniteLoop = 0
    do {
      if (infiniteLoop++ > 200) throw new Error('System loop exceeded limit')
      this.system(playerTurn ? playerAction : __defaultAction())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    console.groupEnd()

    objLog(this.state, `# update complete # ${Date.now() - timeUpdate}ms`, true)

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
    renderMessages2(this.msgDisplay, this.world, this.options)
    renderLevel(this.display, this.world, this.options)
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
      const [newLevel, newEntities] = Generate.dungeon4(true, true)
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
    processFOV(this.world)
    this.render()
  }
}
