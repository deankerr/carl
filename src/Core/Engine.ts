import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import * as Generate from '../Generate'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { logger } from '../lib/logger'
import { ComponentFoundry, EntityPool, UI, input, Region, System } from './'

export type Message = { turn: number; text: string }

export class Engine {
  mainDisplay: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  component = ComponentFoundry
  pool = new EntityPool(this.component)
  system = new System()

  regions: Region[] = []
  local = this.regions[0]

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
    const overseer = Generate.overworld()
    this.local = overseer.current

    this.system.initLocal(this)

    this.keys.add(this.update.bind(this))
    console.log(this)
  }

  update(code: string) {
    const playerAction = input(code)
    if (!playerAction) return

    if ('ui' in playerAction) {
      UI(this, playerAction.ui)
      this.local.hasChanged = true
      return
    }

    this.system.run(this, playerAction)
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
