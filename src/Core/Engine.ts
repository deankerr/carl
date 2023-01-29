import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { PointManager } from '../Model/Point'
import { ComponentsFactory } from './Components'
import { EntityFreezer, terrain, beings, features } from './Entity'
import { input } from './Input'
import { Region } from './Region'
import { renderRegion } from './RenderNew'
import { System } from './System'
// import { ComponentsType } from './Components'

export class Engine {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  point = new PointManager()
  component = ComponentsFactory
  entity = new EntityFreezer(this.component)
  system = new System()

  regions: Region[] = []
  region = this.regions[0]

  constructor() {
    const [msg, main] = createGameDisplay()
    this.display = main
    this.msgDisplay = msg
    msg.drawText(0, 0, 'msg hello')
    main.drawText(0, 0, 'main hello')

    this.entity.load(terrain)
    this.entity.load(features)
    this.entity.load(beings, 'actor')
  }

  init() {
    const region = new Region(CONFIG.generateWidth, CONFIG.generateHeight, 'grass')
    this.point.grid(region.width, region.height, pt => {
      if (pt.x % 3 === 0) region.terrain.set(pt, this.entity.spawn('water', pt))
    })

    region.being('player', this.point.pt(6, 5))
    region.being('spider', this.point.pt(9, 5))
    region.being('shrub', this.point.pt(8, 7))
    renderRegion(region)

    console.log('region:', region)
    console.log('eingine', this)

    this.region = region
    this.keys.add(this.update.bind(this))
  }

  update(code: string) {
    const playerAction = input(code)
    if (!playerAction) return

    this.system.turn(this.region, playerAction)
  }
}
