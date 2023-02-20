import * as ROT from 'rot-js'
import { CONFIG } from '../config'

import { createGameDisplay } from '../lib/display'
import { logger } from '../lib/logger'
import {
  ActionTypes,
  Atlas,
  ComponentFoundry,
  Entity,
  EntityPool,
  handle,
  listen,
  System,
  UI,
  Visualize,
} from './'
import { SpriteManager } from './Sprite'
import { Visualizer } from './Visualizer'

export class Engine {
  mainDisplay: ROT.Display
  msgDisplay: ROT.Display
  textDisplay: ROT.Display

  context: GameContext = 'game'
  attached: Visualizer | undefined

  sprites = new SpriteManager(this)
  component = ComponentFoundry
  pool = new EntityPool(this.sprites)
  system = new System(this)

  atlas = new Atlas()
  local = this.atlas.local()

  messageLog: Message[] = []
  uiMessageLog: Message[] = []

  playerTurns = 0

  options = {
    debugMode: false,
    showHeatMap: true,
  }

  constructor() {
    const [msg, main, text] = createGameDisplay()
    this.mainDisplay = main
    this.msgDisplay = msg
    this.textDisplay = text
  }

  init() {
    this.system.init()
    listen(this.update.bind(this))
    console.log(this)
    if (CONFIG.autoStartVisualizer) this.visualizer(Visualize('init'))
  }

  update(event: KeyboardEvent) {
    const action = handle(event, this.context)
    if (!action) return

    if ('visualize' in action || this.context === 'visualizer') return this.visualizer(action)

    if ('ui' in action) return UI(this, action.ui)

    if ('changeRegion' in action || 'changeZone' in action) {
      this.system.change(action)
      return
    }

    this.system.run(this, action)
    this.playerTurns++
  }

  render() {
    this.system.render(this)

    if (CONFIG.frameLimit)
      setTimeout(() => requestAnimationFrame(this.render.bind(this)), CONFIG.frameLimit)
    else requestAnimationFrame(this.render.bind(this))
  }

  visualizer(action: ActionTypes) {
    if (this.context === 'visualizer' && this.attached) {
      this.attached.update(action)
    } else if (this.local.visualizer) {
      if (this.context === 'game') {
        this.local.visualizer.init()
      }
    }
  }

  // TODO message handler
  message(text: string, entity: Entity) {
    logger('engine', 'message').msg(text)
    if (this.local.player().acting) this.messageLog.push(this.createMessage(text, entity))
  }

  uiMessage(text: string) {
    logger('engine', 'uiMessage').msg(text)
    this.uiMessageLog.push(this.createMessage(text))
  }

  private createMessage(text: string, entity?: Entity): Message {
    return {
      text,
      turn: this.playerTurns,
      time: Date.now(),
      highlight: entity?.name ?? '',
      // color: entity?.tile.color ?? '',
      color: '',
    }
  }
}

export type Message = { text: string; turn: number; time: number; highlight: string; color: string }
export type GameContext = 'game' | 'visualizer'
