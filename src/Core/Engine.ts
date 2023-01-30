/* eslint-disable @typescript-eslint/no-unused-vars */ // !!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import * as Generate from '../Generate'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { PointMan } from '../Model/Point'
import { ComponentFoundry } from './Components'
import { EntityPool, gameTemplates } from './Entity'
import { input } from './Input'
import { Region } from './Region'
import { renderMessages, renderRegion } from './Render'
import { System } from './System'

export type Message = { turn: number; text: string }

export class Engine {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  point = PointMan
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
    // const region = new Region(CONFIG.generateWidth, CONFIG.generateHeight, this.pool, 'grass')
    // region.being('player', this.point.pt(1, 0))
    // region.being('spider', this.point.pt(9, 5))
    // region.feature('shrub', this.point.pt(8, 7))
    const overseer = Generate.overworld()
    this.local = overseer.current
    this.local.initTurnQueue()

    // this.system.run(region)
    this.render()
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
      this.render()
      return
    }

    this.system.player(this.local, playerAction)
    this.playerTurns++
    this.render()
  }

  render() {
    renderRegion(this.local)
    renderMessages(this.messageLog)
  }

  message(newMsg: string) {
    console.log('newMsg:', newMsg)
    console.log('this.:', this)
    this.messageLog.unshift({ turn: this.playerTurns, text: newMsg })
  }
}
