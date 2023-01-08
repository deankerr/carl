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

import { displayDebugStrings, mouseClick } from '../util/display'
import { Keys } from '../util/Keys'
import { half, objLog } from '../util/util'
import { input } from './Input'

import { Dungeon4Data } from '../Generate/dungeon4/dungeon4'
import { handleTread } from '../System/handleTread'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: State
  world: World

  messageNew: string[] = [] // messages generated during the last update
  messageHistory: string[] = [] // previous messages that still fit in the buffer visually

  options = {
    lightsOn: CONFIG.lightsOnInitial, // reveal level debug flag
    hideInternalWalls: true,
    showDisplayDebug: false,
  }

  constructor(d: ROT.Display, loadLevel?: Dungeon4Data) {
    console.log('new Game2')
    const seed = ROT.RNG.getSeed()
    console.log('seed:', seed)
    if (loadLevel) console.log('Loading level')
    this.display = d

    this.state = new State(loadLevel)
    this.world = new World(this.state)

    // mouse click coords
    mouseClick(d, event => {
      const pt = d.eventToPosition(event)
      console.log(`${pt[0]},${pt[1] + CONFIG.renderLevelY1}`)
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
          this.options.lightsOn = !this.options.lightsOn
          console.log('UI: toggleLightSwitch:', this.options.lightsOn)
          break
        case 'toggleInternalWalls':
          this.options.hideInternalWalls = !this.options.hideInternalWalls
          break
        case 'render':
          this.options.showDisplayDebug = true
          this.render()
          console.log('UI: render')
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

  messages() {
    return this.messageNew.join(' ') + '%c{#777} ' + this.messageHistory.join(' ')
  }

  processMessages() {
    const { messages, playerTurns } = this.state.current
    if (messages.length < 1) return

    this.messageHistory = [...this.messageNew, ...this.messageHistory]
    this.messageNew = []

    // put new messages from this turn into current
    if (messages[0][0] === playerTurns) this.messageNew = messages[0][1]

    // clip buffer height
    const maxWidth = this.display.getOptions().width
    while (ROT.Text.measure(this.messages(), maxWidth).height > CONFIG.renderLevelY1 + 1) {
      this.messageHistory.pop()
    }
  }

  system(action: ActionTypes) {
    const { world } = this
    const [entity] = world.get('tagCurrentTurn')

    world.addComponent(entity, acting(action))
    console.groupCollapsed(`System: '${entity.id}' -> '${actionName(action)}'`)

    handleMovement(world)
    handleTread(world)
    handleBump(world)
    handleMeleeAttack(world)
    processDeath(world)
    processFOV(world)

    const [entityDone] = world.get('tagCurrentTurn')
    world.removeComponent(entityDone, 'acting')

    console.groupEnd()
    this.render()
  }

  render() {
    const d = this.display
    const { level } = this.state.current

    const top = CONFIG.renderLevelY1
    const left = half(CONFIG.displayWidthTileset) - half(level.terrain.width)
    const yMax = d.getOptions().height - 1

    d.clear()

    // messages
    d.drawText(0, 0, this.messages())

    const player = this.world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]
    const doors = this.world.get('position', 'render', 'door')
    const entities = this.world.get('position', 'render').filter(e => doors.every(d => d.id !== e.id) && e !== player)

    level.terrain.each((here, t) => {
      const terrain = TerrainDictionary[t]
      const char: string[] = []
      const color: string[] = []

      const visible = player.fov.visible.includes(here.s)
      const seen = player.seen.visible.includes(here.s) || this.options.lightsOn

      // terrain
      const terrainVisible = terrain.render.base
      const terrainSeen = terrain.render.seen

      if (!level.isInternalWall(here) || !this.options.hideInternalWalls) {
        if (visible) {
          char.push(terrainVisible.char)
          color.push(terrainVisible.color)
        } else if (seen) {
          char.push(terrainSeen?.char ?? terrainVisible.char)
          color.push(terrainSeen?.color ?? terrainVisible.color)
        }
      }

      // door
      const door = doors.filter(d => d.position.s === here.s)[0]
      if (door) {
        const open = door.door.open
        const doorChar = open ? door.render?.baseDoorOpen?.char ?? door.render.base.char : door.render.base.char

        if (visible) {
          char.push(doorChar)
          color.push(door.render.base.color)
        } else if (seen) {
          char.push(doorChar)
          color.push(door.render.seen?.color ?? door.render.base.color)
        }
      }

      // entities
      entities
        .filter(e => e.position.s === here.s)
        .forEach(e => {
          if (visible || this.options.lightsOn) {
            char.push(e.render.base.char)
            color.push(e.render.base.color)
          }
        })

      // player
      if (player.position.s === here.s) {
        char.push(player.render.base.char)
        color.push(player.render.base.color)
      }

      char.length > 0
        ? d.draw(
            left + here.x,
            top + here.y,
            char,
            color,
            color.map((_c, i) => (i === 0 ? 'black' : 'transparent'))
          )
        : d.draw(left + here.x, top + here.y, ' ', 'black', null) // blank
    })

    // display debug
    if (this.options.lightsOn && this.options.showDisplayDebug) {
      const ddb = displayDebugStrings(d)
      d.drawText(0, yMax - 1, ddb[0])
      d.drawText(0, yMax, ddb[1])
    }
  }
}
