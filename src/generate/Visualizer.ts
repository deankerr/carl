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

  // New version
  history: string[][][] = []

  // playback
  animate = false
  animating = false
  index = 0
  speed = 200
  speedFast = 50
  speedPause = 500
  cMode = true

  constructor(display: ROT.Display) {
    // console.log('new Visualizer')
    this.display = display
  }

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
        if (this.index >= this.history.length - 1 || this.animating) return
        this.render(++this.index)
        break
      // case 'Space':
      //   this.play()
      //   break
      case 'Escape':
        console.log('stop!')
        this.animating = false
        break

      case 'KeyM':
        console.log('mode')
        this.cMode = !this.cMode
        this.render(this.index)
    }
  }

  play() {
    if (!this.animate) {
      this.renderFinal()
      return
    }
    if (this.animating) return

    this.index = 0
    this.animating = true
    this.nextSnap()
  }

  nextSnap() {
    this.render(this.index)
    if (!this.animating || this.index + 1 >= this.history.length) {
      this.animating = false
      this.index = this.history.length - 1
      this.render(this.index)
      return
    }

    this.index++
    setTimeout(this.nextSnap.bind(this), this.speed)
  }

  render(index = this.index) {
    const display = this.display
    display.clear()

    const cMap = this.history[index]
    const last = cMap[cMap.length - 1]
    const [msg] = last

    cMap.forEach((row, y) =>
      row.forEach((c, x) => {
        if (row !== last) display.draw(x, y + CONFIG.marginTop, c, '#777', null)
      })
    )
    // console.log('test:', msg, speed)
    display.drawText(0, display.getOptions().height - 2, `[${index}] ${msg}`)
    return
  }

  renderFinal() {
    this.index = this.history.length - 1
    this.render()
  }
}

// const colors: { [key: string]: string } = {
//   r: 'red',
//   b: 'blue',
//   g: 'green',
//   c: 'cyan',
//   y: 'yellow',
//   o: 'orange',
//   u: '#333',
// }
