import * as ROT from 'rot-js'

import { CONFIG } from '../config'
import { Keys } from '../keys'

export interface Snapshot {
  level: string[]
  color: string[]
  msg: string
  speed: number
}
export class Visualizer {
  display: ROT.Display
  snapshots: Snapshot[] = []

  // playback
  animate = true
  animating = false
  index = 0
  speed = 250
  speedFast = 50
  speedPause = 400

  constructor(display: ROT.Display) {
    console.log('new Visualizer')
    this.display = display
  }

  // msg, speed
  snapshot(level: string[], color: string[], msg: string) {
    // console.log('Visualizer THIS!!', level)
    let speed = this.speed
    if (msg[0] === `0`) speed = this.speedPause
    this.snapshots.push({ level, color, msg, speed })
  }

  // last() {
  //   return this.snapshots[this.snapshots.length - 1]
  // }

  // lastColor() {
  //   return this.colorSnapShots[this.colorSnapShots.length - 1]
  // }

  active() {
    const keys = new Keys()
    keys.add(this.update.bind(this))
  }

  update(key: string) {
    switch (key) {
      case 'ArrowLeft':
        if (this.index <= 0 || this.animating) return
        this.render(--this.index)
        break
      case 'ArrowRight':
        if (this.index >= this.snapshots.length - 1 || this.animating) return
        this.render(++this.index)
        break
      // case 'Space':
      //   this.play()
      //   break
      case 'Escape':
        console.log('stop!')
        this.animating = false
        break
      case 'KeyQ':
        console.log(this.snapshots.at(-1)?.level)
        console.log(this.snapshots.at(-1)?.color)
        break
    }
  }

  play() {
    // console.log('Viz: play() len: ', this.snapshots.length)
    // console.log(this.snapshots)
    if (!this.animate) {
      this.renderFinal()
      return
    }
    if (this.animating) return

    if (this.snapshots.length == 0) throw new Error('Tried to play but theres no snaps')
    this.index = 0
    this.animating = true
    this.nextSnap()
  }

  nextSnap() {
    this.render(this.index)
    if (!this.animating || this.index + 1 >= this.snapshots.length) {
      this.animating = false
      this.index = this.snapshots.length - 1
      this.render(this.index)
      return
    }
    // console.log(`Anim: ${this.animating}, index: ${this.index}, len: ${this.snapshots.length}`)
    this.index++
    setTimeout(this.nextSnap.bind(this), this.speed)
  }

  render(index = this.index) {
    const display = this.display
    const { level, color, msg, speed } = this.snapshots[index]
    display.clear()

    level.forEach((row, yi) => {
      const r = [...row]
      const c = [...color[yi]]

      r.forEach((t, xi) => {
        // console.log(colors[c[xi]])
        display.draw(xi, yi + CONFIG.marginTop, t, colors[c[xi]] || '#777', null)
      })

      display.drawText(0, display.getOptions().height - 2, `[${index}] ${msg}`)
      // display.drawText(origin.x, origin.y + index, row)
    })
  }

  renderFinal() {
    this.index = this.snapshots.length - 1
    this.render()
  }
}

const colors: { [key: string]: string } = {
  r: 'red',
  b: 'blue',
  g: 'green',
  c: 'cyan',
  y: 'yellow',
  o: 'orange',
  u: '#333',
}
