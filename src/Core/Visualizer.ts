/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!!!!!! dev
// import * as ROT from 'rot-js'

import { ActionTypes, Engine, Entity, EntityKey, Region } from '.'
import { CONFIG } from '../config'
import { genHistory, GenHistory } from '../Generate/Overseer2'
import { half, range, repeat } from '../lib/util'
import { Point, point, pointRect } from '../Model/Point'

export class Visualizer {
  engine = window.game
  mirror: Region
  player: Entity
  built: GenHistory[] = []

  speed = 550
  index = 0
  playing = false
  timeout = 0

  constructor(targetRegion: Region, readonly history: GenHistory[]) {
    const { width, height } = targetRegion

    const player = this.engine.pool.spawn('player', point(0, 0))

    const r = new Region(width, height, player)
    r.revealAll = true
    r.name = 'mirror world'

    this.player = player
    this.mirror = r
    console.log('visualizer created')
  }

  init() {
    this.engine.context = 'visualizer'
    this.engine.attached = this
    this.engine.local = this.mirror
    this.engine.mainDisplay.setOptions({ width: this.mirror.width, height: this.mirror.height })
    this.build()
    this.play()
  }

  update(action: ActionTypes) {
    if ('move' in action) {
      const { dir } = action.move
      if (dir === 'W') this.back()
      if (dir === 'E') this.forward()
    }

    if ('visualize' in action) {
      const { visualize } = action
      if (visualize === 'exit') this.exit()
      if (visualize === 'start') this.start()
      if (visualize === 'middle') this.middle()
      if (visualize === 'end') this.end()
      if (visualize === 'pause' && this.playing) this.stop()
      else if (visualize === 'pause' && !this.playing) this.play()
    }
  }

  play() {
    if (this.index + 1 >= this.history.length) {
      this.stop()
      this.mirror.name = 'Complete'
      this.mirror.hasChanged = true
      return
    }
    this.playing = true
    this.index++
    this.next()

    this.timeout = setTimeout(this.play.bind(this), this.speed)
  }

  next() {
    const { terrain, features, beings, message } = this.built[this.index]
    this.mirror.name = `(${this.index}) ${message}`

    pointRect(0, 0, this.mirror.width, this.mirror.height, pt => {
      const t = terrain.get(pt)
      if (t) this.mirror.createTerrain(pt, t)
    })

    this.mirror.entityList = [this.player]
    for (const [pt, f] of features) {
      if (f === '[clear]') {
        const features = this.mirror.get('position').filter(e => e.position === pt)
        features.forEach(f => this.mirror.destroyEntity(f))
      } else {
        this.mirror.createEntity(pt, f)
      }
    }

    for (const [pt, b] of beings) {
      this.mirror.createEntity(pt, b)
    }
    this.mirror.evaluateTerrainVariants()
  }

  stop() {
    clearTimeout(this.timeout)
    this.playing = false
  }

  start() {
    this.stop()
    this.index = 0
    this.next()
  }

  middle() {
    this.stop()
    this.index = half(this.built.length)
    this.next()
  }

  end() {
    this.stop()
    this.index = this.built.length - 1
    this.next()
  }

  back() {
    this.stop()
    if (this.index <= 0) return
    this.index--
    this.next()
  }

  forward() {
    this.stop()
    if (this.index >= this.history.length - 1) return
    this.index++
    this.next()
  }

  build() {
    if (this.built.length > 0) return

    const initial = genHistory()

    pointRect(0, 0, this.mirror.width, this.mirror.height, pt => {
      initial.terrain.set(pt, 'nothing')
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
    // console.log('this.built:', this.built)
  }

  exit() {
    console.log('vis exit')
    this.stop()
    this.engine.mainDisplay.setOptions({
      width: CONFIG.mainDisplayWidth,
      height: CONFIG.mainDisplayHeight,
    })
    this.engine.context = 'game'
    this.engine.attached = undefined
    this.engine.local = this.engine.atlas.local()
    this.engine.local.hasChanged = true
  }
}
