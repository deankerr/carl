import { ActionTypes, Entity, Region } from '.'
import { CONFIG } from '../config'
import { Snapshot } from '../Generate/Overseer3'
import { half } from '../lib/util'

export class Visualizer {
  engine = window.game
  mirror: Region

  speed = 750
  index = 0
  playing = false
  timeout = 0

  constructor(targetRegion: Region, readonly history: Snapshot[]) {
    const { width, height } = targetRegion

    const r = new Region(width, height)
    r.revealAll = true
    r.name = 'mirror world'

    this.mirror = r
    console.log('visualizer created')
  }

  init() {
    this.engine.context = 'visualizer'
    this.engine.attached = this
    this.engine.local = this.mirror
    this.engine.mainDisplay.setOptions({ width: this.mirror.width, height: this.mirror.height })
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
      return
    }
    this.playing = true
    this.index++
    this.next()

    const speed = this.mirror.name.includes('CSP - Invalid') ? 50 : this.speed
    this.timeout = setTimeout(this.play.bind(this), speed)
  }

  next() {
    const { terrainMap, debugSymbolMap, entityList, message, ghostMap } = this.history[this.index]

    const ghosts: Entity[] = []
    for (const [pt, keys] of ghostMap) {
      keys.forEach(key => ghosts.push(this.mirror.pool.spawn(key, pt)))
    }

    this.mirror.name = `[${this.index}/${this.history.length - 1}] ${message}`
    this.mirror.terrainMap = terrainMap
    this.mirror.debugSymbolMap = debugSymbolMap
    this.mirror.entityList = [...entityList, ...ghosts]
    this.mirror.hasChanged = true
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
    this.index = half(this.history.length)
    this.next()
  }

  end() {
    this.stop()
    this.index = this.history.length - 1
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
