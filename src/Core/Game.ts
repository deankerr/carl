// Game: should handle the initial invocation of World etc.
// the main update/render/input loop. Executes Systems loop

import { CONFIG } from '../config'
import * as ROT from 'rot-js'

import { State } from './State'
import { World } from './World'
import { TerrainDictionary } from './Terrain'

import { acting } from './Components'
import { handleBump, processDeath, handleMovement, processFOV, handleMeleeAttack } from '../System'
import { actionName, ActionTypes, __randomMove, __wait } from '../Action'

import { mouseClick } from '../util/display'
import { Keys } from '../util/Keys'
import { objLog } from '../util/util'
import { input } from './Input'

import { PtS } from '../Model/Point'

import { Dungeon4Data } from '../Generate/dungeon4/dungeon4'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: State
  world: World

  lightsOn = false // reveal level debug flag
  hideInternalWalls = true

  constructor(d: ROT.Display, loadLevel?: Dungeon4Data) {
    console.log('new Game2')
    if (loadLevel) console.log('Loading level')
    this.display = d

    this.state = new State(loadLevel)
    this.world = new World(this.state)

    // mouse click coords
    mouseClick(d, (event) => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1] + CONFIG.marginTop}`)
    })

    this.processMessages()
    processFOV(this.world)
    this.render()

    this.keys.add(this.update.bind(this))

    objLog(this.state.current, 'Initial state')
  }

  update(code: string) {
    const timeUpdate = Date.now()
    const { playerTurns } = this.state.current
    console.group(`# update # key: '${code}', turn: '${playerTurns}'`)
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

    // * temp: all npc entities do this action
    const __defaultActions = { wander: __randomMove, wait: __wait }
    const __defaultAction = __defaultActions.wander

    // Run systems on each entity until it's the player's turn again
    let playerTurn = true
    this.state.increasePlayerTurns()
    do {
      this.system(playerTurn ? playerAction : __defaultAction())
      playerTurn = world.nextTurn()
    } while (!playerTurn)

    this.processMessages()

    console.groupEnd()

    objLog(this.state.current, `# update complete # ${Date.now() - timeUpdate}ms`, true)

    this.render()
  }

  messageCurrent: string[] = [] // messages generated during the last update
  messageBuffer: string[] = [] // previous messages that still fit in the buffer visually

  processMessages() {
    const { messages, playerTurns } = this.state.current
    if (messages.length < 1) return

    this.messageBuffer = [...this.messageCurrent, ...this.messageBuffer]
    this.messageCurrent = []

    // new messages from this turn, put into current
    if (messages[0][0] === playerTurns) this.messageCurrent = messages[0][1]
  }

  system(action: ActionTypes) {
    const { world } = this
    const [entity] = world.get('tagCurrentTurn')

    world.addComponent(entity, acting(action))
    console.groupCollapsed(`System: '${entity.id}' -> '${actionName(action)}'`)

    handleMovement(world)
    handleBump(world)
    handleMeleeAttack(world)
    processDeath(world)
    processFOV(world)

    const [entityDone] = world.get('tagCurrentTurn')
    world.removeComponent(entityDone, 'acting')

    console.groupEnd()
    this.render()
  }

  // TODO make independent of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    const d = this.display
    const top = CONFIG.marginTop

    const { level } = this.state.current

    d.clear()
    d.drawText(0, 0, this.messageCurrent.join(' ') + '%c{#777} ' + this.messageBuffer.join(' '))

    // terrain
    const { terrain } = level
    const isInternalWall = level.isInternalWall.bind(level)
    const player = this.world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]

    terrain.each((x, y, t) => {
      // TODO TerrainDict function, return default results for unknown?
      // ? maybe we should just crash

      // skip rendering if this is a wall surrounded by other walls
      // currently only to make lightsOn view look nicer
      if (this.lightsOn && this.hideInternalWalls && isInternalWall(x, y)) return

      const here = PtS(x, y)
      // currently visible by player
      if (player.fov.visible.includes(here)) {
        const { char, color } = TerrainDictionary[t]?.console ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      } else if (player.seen.visible.includes(here) || this.lightsOn) {
        // seen previously
        const { char, color } = TerrainDictionary[t]?.consoleSeen ?? { char: t, color: 'red' }
        this.display.draw(x, top + y, char, color, null)
      } else {
        // blank space (currently needed to clip message buffer)
        this.display.draw(x, top + y, ' ', 'black', null)
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
