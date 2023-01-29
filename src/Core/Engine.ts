import * as ROT from 'rot-js'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { PointManager } from '../Model/Point'
import { ComponentsFactory } from './Components'
import { EntityFreezer, terrain, beings, features } from './Entity'
import { Region } from './Region'
import { renderRegion } from './RenderNew'
// import { ComponentsType } from './Components'

export class Engine {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  point = new PointManager()
  component = ComponentsFactory
  entity = new EntityFreezer(this.component)

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
    const region = new Region(59, 29, 'grass')
    this.point.grid(region.width, region.height, pt => {
      if (pt.x % 3 === 0) region.terrain.set(pt, this.entity.spawn('path', pt))
    })

    region.being('player', this.point.at(5, 5))
    region.being('spider', this.point.at(8, 5))

    region.being('shrub', this.point.at(8, 7))

    renderRegion(region)

    console.log('region:', region)
    console.log('eingine', this)
  }
}
