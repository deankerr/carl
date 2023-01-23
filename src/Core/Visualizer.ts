/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!!!!!! dev
import * as ROT from 'rot-js'
import { Overseer } from '../Generate/Overseer'
import { Keys } from '../lib/Keys'
import { Game } from './Game'
import { World } from './World'
import { renderLevel, renderMessages } from './Render'
import { Level } from '../Model/Level'
import { hydrate } from './Entity'
import { Beings } from '../Templates'
import { Pt, StrPt } from '../Model/Point'
import { CONFIG } from '../config'

export class Visualizer {
  overseer: Overseer
  worldProxy: World
  level: Level
  playing = false
  speed = 250

  constructor(
    readonly display: ROT.Display,
    readonly msgDisplay: ROT.Display,
    world: World,
    readonly keys: Keys,
    readonly restoreGame: Game['restoreContext']
  ) {
    console.log('Visualizer init')
    this.overseer = world.active.overseer

    const level = new Level('false level', this.overseer.reset())
    const player = hydrate(Beings.player, Pt(-1, -1), 5)
    level.entities.push(player)
    this.level = level

    const handler = {
      get(target: World, prop: keyof World) {
        if (prop === 'active') return level
        // console.log('SPY', prop)
        return Reflect.get(target, prop)
      },
    }

    this.worldProxy = new Proxy(world, handler)
    if (CONFIG.visualizerLast) {
      this.overseer.last().forEach(m => {
        for (const [pt, e] of m) this.level.entities.push(hydrate(e, StrPt(pt)))
      })
    }
    this.render()

    this.keys.add(this.input.bind(this))
    this.play()
  }

  input(code: string) {
    switch (code) {
      case 'KeyR':
        console.log('Visualizer: reset')
        this.playing = false
        this.overseer.reset()
        this.render()
        break
      case 'KeyN':
        console.log('Visualizer: next')
        this.next()
        this.render()
        break
      case 'Space':
        if (this.playing) {
          console.log('Visualizer: pause')
          this.playing = false
        } else {
          console.log('Visualizer: play')
          this.playing = true
          this.play()
        }
        break
      case 'KeyV':
        return this.return()
      default:
        console.log('Visualizer: no action for', code)
    }
  }

  next() {
    if (!this.playing) return
    const more = this.overseer.next()
    if (more !== false && Array.isArray(more)) {
      more.forEach(m => {
        for (const [pt, e] of m) this.level.entities.push(hydrate(e, StrPt(pt)))
      })
    }
    this.render()
    if (more && this.playing) this.play()
    else this.playing = false
  }

  play() {
    this.playing = true
    setTimeout(() => requestAnimationFrame(this.next.bind(this)), this.speed)
  }

  render() {
    renderLevel(this.display, this.worldProxy)
    this.msgDisplay.clear()
    this.msgDisplay.drawText(0, 3, 'Visualizer ' + this.overseer.index)
  }

  return() {
    console.log('Visualizer cleanup')
    this.playing = false
    this.keys.cleanup()
    this.restoreGame()
  }
}
