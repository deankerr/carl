import * as ROT from 'rot-js'
import { CONFIG } from '../config'

import { createGameDisplay } from '../lib/display'
import { logger } from '../lib/logger'
import { ComponentFoundry, EntityPool, UI, handle, listen, System, Atlas } from './'

export type Message = { turn: number; text: string }

export class Engine {
  mainDisplay: ROT.Display
  msgDisplay: ROT.Display

  component = ComponentFoundry
  pool = new EntityPool(this.component)
  system = new System(this)

  atlas = new Atlas()
  local = this.atlas.local()

  messageLog: Message[] = []
  playerTurns = 0

  options = {
    playerLight: true,
    formUpdate: true,
    lightingUpdate: true,
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

  message(newMsg: string) {
    logger('engine', 'message').msg(newMsg)
    if (this.local.player().acting)
      this.messageLog.unshift({ turn: this.playerTurns, text: newMsg })
  }

  uiMessage(newMsg: string) {
    logger('engine', 'uiMessage').msg(newMsg)
    this.messageLog.unshift({ turn: this.playerTurns, text: newMsg })
  }
}
