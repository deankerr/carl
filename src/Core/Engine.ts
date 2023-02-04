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

export type Message = { turn: number; text: string; highlight: string; color: string }

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

  message(newMsg: string, entity: Entity) {
    logger('engine', 'message').msg(newMsg)
    if (this.local.player().acting)
      this.messageLog.push({
        turn: this.playerTurns,
        text: newMsg,
        highlight: entity?.name ?? '',
        color: entity?.form.color ?? '',
      })
  }

  uiMessage(newMsg: string) {
    logger('engine', 'uiMessage').msg(newMsg)
    this.uiMessageLog.push({ turn: this.playerTurns, text: newMsg, highlight: '', color: '' })
  }

  visualizer(vis: ActionTypes) {
    if (this.atlas.local().visualizer === undefined) return false
    const result = this.atlas.local()?.visualizer?.run(vis)
    return result
  }
}
