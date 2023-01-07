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
import { objLog } from '../util/util'
import { input } from './Input'

import { Pt } from '../Model/Point'

import { Dungeon4Data } from '../Generate/dungeon4/dungeon4'
import { handleTread } from '../System/handleTread'

export class Game {
  display: ROT.Display
  keys = new Keys()
  state: State
  world: World

  messageCurrent: string[] = [] // messages generated during the last update
  messageBuffer: string[] = [] // previous messages that still fit in the buffer visually
  // dummy display for checking wrapped message height
  messageDummyDisplay = new ROT.Display({ width: CONFIG.displayWidth, height: CONFIG.displayHeight })

  lightsOn = CONFIG.lightsOnInitial // reveal level debug flag
  showDisplayDebug = false
  hideInternalWalls = true

  constructor(d: ROT.Display, loadLevel?: Dungeon4Data) {
    console.log('new Game2')
    const seed = ROT.RNG.getSeed()
    console.log('seed:', seed)
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
        case 'render':
          this.showDisplayDebug = true
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

  processMessages() {
    const { messages, playerTurns } = this.state.current
    if (messages.length < 1) return

    this.messageBuffer = [...this.messageCurrent, ...this.messageBuffer]
    this.messageCurrent = []

    // put new messages from this turn into current
    if (messages[0][0] === playerTurns) this.messageCurrent = messages[0][1]
    // ! ROT.Text.measure???
    // clip buffer height
    while (
      this.messageDummyDisplay.drawText(0, 0, this.messageCurrent.join(' ') + ' ' + this.messageBuffer.join(' ')) > 3
    ) {
      this.messageBuffer.pop()
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

  // TODO make independent of turn queue - animations/non-blocking/ui updates during turns
  // TODO ie. debug coords at mouse display
  render() {
    const d = this.display
    const top = CONFIG.marginTop
    const yMax = d.getOptions().height - 1
    const useOryx = CONFIG.useTSDisplay

    const world = this.world
    const { level } = this.state.current

    d.clear()
    d.drawText(0, 0, this.messageCurrent.join(' ') + '%c{#777} ' + this.messageBuffer.join(' '))

    // terrain
    const { terrain } = level
    const isInternalWall = level.isInternalWall.bind(level)
    const player = this.world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]

    terrain.each((pt, t) => {
      // TODO TerrainDict function, return default results for unknown?
      // TODO "renderAs" function, pass a whole render component and it choses the correct char/color
      // ? maybe we should just crash

      const here = pt

      // temp oryx path variants
      // let pathChar = 'O^.'
      // if (useOryx) {
      //   if (x % 4 === 0 && y % 2 === 0) pathChar = 'O^.' + (((y + x) % 4) + 2)
      // }

      const terrain = TerrainDictionary[t]
      const terrainColor = useOryx ? terrain.render.oryxColor : terrain.render.color
      const terrainSeen = useOryx ? terrain.seen.oryxColor : terrain.render.color
      const terrainChar = useOryx ? terrain.render.oryxChar : terrain.render.textChar
      // if (useOryx) {
      //   if (terrain.title === 'path') {
      //     if (x % 5 === 0)
      //   }
      // }

      if (player.fov.visible.includes(here.s)) {
        // currently visible by player
        d.draw(pt.x, top + pt.y, terrainChar, terrainColor, null)
        // seen previously
      } else if (player.seen.visible.includes(here.s) || (this.lightsOn && !isInternalWall(pt))) {
        d.draw(pt.x, top + pt.y, terrainChar, terrainSeen, null)
        // blank space (currently needed to clip message buffer)
      } else {
        d.draw(pt.x, top + pt.y, ' ', 'black', null)
      }
    })

    // entities
    const entities = this.world.get('render', 'position')

    for (const entity of entities) {
      const { render, position } = entity
      const here = Pt(position.x, position.y).s

      // use oryxChar if applicable

      // currently visible entities
      if (player.fov.visible.includes(here) || this.lightsOn) {
        d.draw(position.x, top + position.y, render.base.char, render.base.color, null)
      }
      // seen furniture
      else {
        const seenEntity = world.with(entity, 'renderSeenColor')
        if (seenEntity && player.seen.visible.includes(here)) {
          d.draw(position.x, top + position.y, entity.render.base.char, entity.render.base.color, null)
        }
      }
    }

    // player again
    const pT = world.here(Pt(player.position.x, player.position.y))[0]
    const { textChar, color, oryxChar, oryxColor } = pT.render
    d.draw(
      player.position.x,
      top + player.position.y,
      [useOryx ? oryxChar : textChar, player.render.base.char],
      [useOryx ? oryxColor : color, player.render.base.color],
      ['black', 'transparent']
    )

    // display debug
    if (this.lightsOn && this.showDisplayDebug) {
      const ddb = displayDebugStrings(d)
      d.drawText(0, yMax - 1, ddb[0])
      d.drawText(0, yMax, ddb[1])
    }
  }
}
