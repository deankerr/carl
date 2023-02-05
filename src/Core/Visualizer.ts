/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!!!!!! dev
// import * as ROT from 'rot-js'

import { ActionTypes, Engine, Entity, EntityKey, Region } from '.'
import { CONFIG } from '../config'
import { genHistory, GenHistory } from '../Generate/Overseer2'
import { range, repeat } from '../lib/util'
import { Point, point, pointRect } from '../Model/Point'

export class Visualizer {
  engine = window.game
  mirror: Region
  player: Entity
  active = false

  speed = 550
  index = 0
  playing = false

  constructor(targetRegion: Region, readonly history: GenHistory[]) {
    const { width, height, palette } = targetRegion

    const player = this.engine.pool.spawn('player', point(0, 0))
    player.form = { char: '%', color: 'red', bgColor: 'transparent' }

    const r = new Region(width, height, this.engine.pool, player)
    r.revealAll = true
    r.palette = palette
    r.name = 'mirror world'

    this.player = player
    this.mirror = r
    console.log('visualizer created')
  }

  run(action: ActionTypes | true) {
    if (action === true || ('visualize' in action && !this.active)) {
      console.log('vis init')
      this.engine.local = this.mirror
      this.engine.mainDisplay.setOptions({ width: this.mirror.width, height: this.mirror.height })
      this.build()
      this.active = true
      this.playing = true
      this.play()
      return true
    }

    if (!this.active) return false

    if (this.active) {
      if ('move' in action) {
        const { dir } = action.move
        if (dir === 'W') this.back()
        if (dir === 'E') this.forward()
        return true
      }
      this.exit()
    }

    return false
  }

  play() {
    if (!this.playing || this.index + 1 >= this.history.length) {
      this.mirror.name = 'Complete'
      this.mirror.hasChanged = true
      if (CONFIG.visualizerAutoClose) this.exit()
      return
    }
    this.index++
    this.next()

    setTimeout(this.play.bind(this), this.speed)
  }

  next() {
    const { terrain, features, beings, message } = this.built[this.index]
    this.mirror.name = `(${this.index}) ${message}`

    pointRect(0, 0, this.mirror.width, this.mirror.height, pt => {
      const t = terrain.get(pt)
      if (t) this.mirror.createTerrain(t, pt)
    })

    for (const [pt, f] of features) {
      this.mirror.createTerrain(f, pt)
    }

    for (const [pt, b] of beings) {
      this.mirror.createTerrain(b, pt)
    }
  }

  back() {
    if (this.index <= 0) return
    this.index--
    this.next()
  }

  forward() {
    if (this.index >= this.history.length - 1) return
    this.index++
    this.next()
  }

  built: GenHistory[] = []
  build() {
    const initial = genHistory()

    pointRect(0, 0, this.mirror.width, this.mirror.height, pt => {
      initial.terrain.set(pt, 'ground')
    })
    initial.message = 'initial'

    for (const i of range(this.history.length - 1)) {
      const { terrain, features, beings, message } = this.history[i]

      const prev = i == 0 ? initial : this.built[i - 1]

      const h = {
        terrain: new Map([...prev.terrain, ...terrain]),
        features: new Map([...prev.features, ...features]),
        beings: new Map([...prev.beings, ...beings]),
        message,
      }

      this.built.push(h)
    }
    console.log('this.built:', this.built)
  }

  exit() {
    console.log('vis exit')
    this.engine.mainDisplay.setOptions({
      width: CONFIG.mainDisplayWidth,
      height: CONFIG.mainDisplayHeight,
    })
    this.active = false
    this.engine.local = this.engine.atlas.local()
    this.engine.local.hasChanged = true
  }
}
