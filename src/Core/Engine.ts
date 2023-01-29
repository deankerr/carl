import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { createGameDisplay } from '../lib/display'
import { Keys } from '../lib/Keys'
import { PointMan } from '../Model/Point'
import { ComponentFoundary } from './Components'
import { EntityHive, terrain, beings, features } from './Entity'
import { input } from './Input'
import { Region } from './Region'
import { renderRegion } from './RenderNew'
import { System } from './System'

export class Engine {
  display: ROT.Display
  msgDisplay: ROT.Display
  keys = new Keys()

  point = PointMan
  component = ComponentFoundary
  hive = new EntityHive(this.component)
  system = new System()

  regions: Region[] = []
  region = this.regions[0]

  constructor() {
    const [msg, main] = createGameDisplay()
    this.display = main
    this.msgDisplay = msg
    msg.drawText(0, 0, 'msg hello')
    main.drawText(0, 0, 'main hello')

    this.hive.load(terrain)
    this.hive.load(features)
    this.hive.load(beings, 'actor')
  }

  init() {
    const region = new Region(CONFIG.generateWidth, CONFIG.generateHeight, 'grass', this.hive)
    this.point.grid(region.width, region.height, pt => {
      if (pt.x % 3 === 0) region.terrain.set(pt, this.hive.spawn('water', pt))
    })

    region.being('player', this.point.pt(1, 0))
    region.being('spider', this.point.pt(9, 5))
    region.feature('shrub', this.point.pt(8, 7))
    renderRegion(region)

    this.region = region
    this.system.run(region)
    this.keys.add(this.update.bind(this))
    console.log('Engine ready', this)
  }

  update(code: string) {
    const playerAction = input(code)
    if (!playerAction) return

    if ('ui' in playerAction) {
      if (playerAction.ui === 'debug_logworld') console.log(this)
      renderRegion(this.region)
      return
    }

    this.system.player(this.region, playerAction)
    renderRegion(this.region)
  }
}
