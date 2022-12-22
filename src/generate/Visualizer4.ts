import * as ROT from 'rot-js'
import { Keys } from '../keys'
import { CharMap } from './Dungeon4'

let d: ROT.Display
let history: CharMap[]
let index = -1
let last: number
let animating = true

const debugid = ROT.RNG.getUniformInt(1000, 9999)

const speedMap: { [key: string]: number } = {
  default: 200,
  roomfail: 75,
  roomsuccess: 200,
  corrstart: 1000,
  corrsuccess: 1000,
  flood: 75,
  floodhit: 1000,
  path: 75,
  pathfail: 1000,
}

export function Visualizer4(display: ROT.Display, h: CharMap[], keys: Keys) {
  console.log('Visualizer4', debugid)
  d = display
  history = h
  last = history.length - 1
  keys.add(control)

  // coords viewer
  const ctx = display.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', (event) => {
      const ev = display.eventToPosition(event)
      d.drawText(0, 0, '......')
      d.drawText(0, 0, `${ev[0]}, ${ev[1] - 2}`)
    })
  }

  if (animating) {
    play()
  } else {
    index = last
    render(index)
  }
}

function play() {
  // console.log('play')
  index++
  render(index)
  if (index >= last) return
  if (animating) {
    const group = history[index][0][1]
    const speedTag = speedMap[group]
    // console.log(group, speedTag)

    setTimeout(play, speedTag ? speedTag : speedMap['default'])
  }
}

function render(index: number) {
  d.clear()
  const map = history[index]
  map.forEach((row, yi) => {
    if (yi !== 0) {
      row.forEach((char, xi) => {
        let color = '#AAA'
        if (char === 'x') color = 'red'
        if ('0123456789'.includes(char)) color = 'orange'
        if (char === 'f') color = 'cyan'
        if (char === 'F') color = 'lime'
        if (char === 'C') color = 'cyan'
        if (char === 'p') color = 'yellow'
        d.draw(xi, yi + 1, char, color, null)
      })
    }
  })

  const msg = map[0][0]
  const group = map[0][1]
  d.drawText(0, d.getOptions().height - 2, `[${index}-${group}] ${msg}`)
}

function control(key: string) {
  switch (key) {
    case 'Space':
      console.log('Vis4: replay')
      index = 0
      animating = true
      play()
      break
    case 'ArrowLeft':
      console.log('Vis4: left', debugid)
      if (index - 1 < 0) break
      animating = false
      index--
      render(index)
      break
    case 'ArrowRight':
      // console.log('Vis4: right')
      if (index + 1 >= history.length) break
      animating = false
      index++
      render(index)
      break
    case 'Escape':
      console.log('Vis4: stop')
      animating = false
      // index--
      console.log(index)
      break
    case 'Digit1':
      // goto start
      animating = false
      index = 0
      render(index)
      break
    case 'Digit2':
      // goto corrstart
      animating = false
      index = history.findIndex((h) => h[0][1] === 'corrstart')
      render(index)
      break
    case 'Digit3':
      // goto final
      animating = false
      index = last
      render(index)
  }
}
