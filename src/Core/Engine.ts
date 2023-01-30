import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { PointMan } from '../Model/Point'
import { ComponentFoundry } from './Components'
import { EntityPool, gameTemplates } from './Entity'
import { input } from './Input'
import { Region } from './Region'
import { renderMessages, renderRegion } from './RenderNew'
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
  region = this.regions[0]

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
    const region = new Region(CONFIG.generateWidth, CONFIG.generateHeight, 'grass', this.pool)
    this.point.grid(region.width, region.height, pt => {
      if (pt.x % 3 === 0) region.terrain.set(pt, this.pool.spawn('water', pt))
    })

    region.being('player', this.point.pt(1, 0))
    region.being('spider', this.point.pt(9, 5))
    region.feature('shrub', this.point.pt(8, 7))
    this.region = region

    // const p = this.pool.entity(region.player()).modify('tag', 'testTag').modify('name', 'bart').done()
    // console.log('var:', p)
    //----
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
      if (playerAction.ui === 'debug_logentities') console.log('Local entities', this.region.entities)
      renderRegion(this.region)
      return
    }

    this.system.player(this.region, playerAction)
    this.playerTurns++
    this.render()
  }

  render() {
    renderRegion(this.region)
    renderMessages(this.messageLog)
  }

  message(newMsg: string) {
    console.log('newMsg:', newMsg)
    console.log('this.:', this)
    this.messageLog.unshift({ turn: this.playerTurns, text: newMsg })
  }
}
