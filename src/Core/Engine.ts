/* eslint-disable @typescript-eslint/no-unused-vars */ // !!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import * as Generate from '../Generate'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { ComponentFoundry } from './Components'
import { EntityPool, gameTemplates } from './Entity'
import { input } from './Input'
import { Region } from './Region'
import { renderMessages } from './Render'
import { System } from './System'

export type Message = { turn: number; text: string }

export class Engine {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  component = ComponentFoundry
  pool = new EntityPool(this.component, gameTemplates)
  system = new System()

  regions: Region[] = []
  local = this.regions[0]

  messageLog: Message[] = []
  playerTurns = 0

  constructor() {
    const [msg, main] = createGameDisplay()
    this.display = main
    this.msgDisplay = msg
    msg.drawText(0, 0, 'msg hello')
    main.drawText(0, 0, 'main hello')
  }

  init() {
    const overseer = Generate.overworld()
    this.local = overseer.current
    this.local.initTurnQueue()

    this.render()

    this.system.run(this.local)
    this.keys.add(this.update.bind(this))
    console.log('Engine ready', this)
  }

  update(code: string) {
    const playerAction = input(code)
    if (!playerAction) return

    if ('ui' in playerAction) {
      if (playerAction.ui === 'debug_logworld') console.log(this)
      if (playerAction.ui === 'debug_logentities') console.log('Local entities', this.local.entities)
      if (playerAction.ui === 'debug_loglocal') console.log('Local', this.local)
      return
    }

    this.system.player(this.local, playerAction)
    this.playerTurns++
  }

  render() {
    // renderRegion(this.local)
    this.system.runRender(this.local, this.display)
    renderMessages(this.messageLog)
    setTimeout(() => requestAnimationFrame(this.render.bind(this)), CONFIG.frameLimit)
  }

  message(newMsg: string) {
    console.log('newMsg:', newMsg)
    console.log('this.:', this)
    this.messageLog.unshift({ turn: this.playerTurns, text: newMsg })
  }
}
