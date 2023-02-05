import * as ROT from 'rot-js'
import { CONFIG } from '../config'

import { createGameDisplay } from '../lib/display'
import { logger } from '../lib/logger'
import {
  ComponentFoundry,
  EntityPool,
  UI,
  handle,
  listen,
  System,
  Atlas,
  Entity,
  ActionTypes,
} from './'

export class Engine {
  mainDisplay: ROT.Display
  msgDisplay: ROT.Display

  component = ComponentFoundry
  pool = new EntityPool(this.component)
  system = new System(this)

  atlas = new Atlas()
  local = this.atlas.local()

  messageLog: Message[] = []
  uiMessageLog: Message[] = []

  playerTurns = 0

  options = {
    playerLight: true,
    formUpdate: true,
    lightingUpdate: true,
    debugMode: false,
  }

  constructor() {
    const [msg, main] = createGameDisplay()
    this.mainDisplay = main
    this.msgDisplay = msg
  }

  init() {
    this.system.init()
    listen(this.update.bind(this))
    console.log(this)
    if (CONFIG.autoStartVisualizer) this.visualizer(true)
  }

  update(event: KeyboardEvent) {
    const action = handle(event)
    if (!action) return

    if (this.visualizer(action)) return

    // console.log('eng action:', action)
    if ('ui' in action) return UI(this, action.ui)

    if ('changeRegion' in action || 'changeDomain' in action) {
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

  visualizer(vis: ActionTypes | true) {
    if (this.atlas.local().visualizer === undefined) return false
    const result = this.atlas.local()?.visualizer?.run(vis)
    return result
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
      color: entity?.form.color ?? '',
    }
  }
}

export type Message = { text: string; turn: number; time: number; highlight: string; color: string }
