// TODO speed presets?
import * as ROT from 'rot-js'
import { CharMap } from './Dungeon4'

let d: ROT.Display
let history: CharMap[]
let index = -1
let last: number
let animating = false
let nextFrame: number

const animate = true

const speedMap: { [key: string]: number } = {
  default: 200,
  // roomfail: 75,
  // roomsuccess: 200,
  roomfail: 10,
  roomsuccess: 10,
  // corrstart: 1000,
  corrstart: 500,
  corrsuccess: 1000,
  flood: 10,
  floodhit: 200,
  path: 30,
  pathfail: 1000,
  pathtarget: 1000,
  shift: 50,
}

export function Visualizer4(display: ROT.Display) {
  console.log('Visualizer4')
  d = display

  // coords display
  const ctx = display.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', mouse)
  }

  return { start, control }
}

function start(h: CharMap[]) {
  stop()
  history = h
  last = history.length - 1
  index = 0

  if (animate) {
    animating = true
    play()
  } else {
    index = last
    render(index)
  }
}

function play() {
  if (!animating) return
  render(++index)
  if (index >= last) {
    index--
    animating = false
    return
  }
  const group = history[index][0][1]
  const speedTag = speedMap[group]
  nextFrame = setTimeout(play, speedTag ? speedTag : speedMap['default'])
}

function stop() {
  clearTimeout(nextFrame)
  animating = false
}

function render(index: number) {
  d.clear()
  const map = history[index]
  map.forEach((row, yi) => {
    if (yi !== 0) {
      row.forEach((char, xi) => {
        let color = '#888'
        if (colorMap[char]) color = colorMap[char]
        if ('0123456789'.includes(char)) color = 'orange'

        d.draw(xi, yi + 1, char, color, null)
      })
    }
  })

  const msg = map[0][0]
  const group = map[0][1]
  d?.drawText(0, d.getOptions().height - 2, `[${index}-${group}] ${msg}`)
}

const colorMap: { [key: string]: string } = {
  x: 'red',
  f: 'cyan',
  F: 'lime',
  C: 'cyan',
  p: 'yellow',
  '+': 'saddlebrown',
  c: 'orange',
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
      if (index - 1 < 0) break
      stop()
      index--
      render(index)
      break
    case 'ArrowRight':
      if (index + 1 >= history.length) break
      stop()
      index++
      render(index)
      break
    case 'Escape':
      console.log('Vis4: stop')
      stop()
      console.log(index)
      break
    case 'Digit1':
      // goto start
      stop()
      index = 0
      render(index)
      break
    case 'Digit2':
      // goto corrstart
      stop()
      index = history.findIndex((h) => h[0][1] === 'corrstart')
      render(index)
      break
    case 'Digit3':
      // goto final
      stop()
      index = last
      render(index)
      break
  }
}

function mouse(event: MouseEvent) {
  const dis = d
  const ev = dis.eventToPosition(event)
  d.draw(6, 0, ' ', 'black', null)
  d.draw(5, 0, ' ', 'black', null)
  d.draw(4, 0, ' ', 'black', null)
  d.draw(3, 0, ' ', 'black', null)
  d.draw(2, 0, ' ', 'black', null)
  d.draw(1, 0, ' ', 'black', null)
  d.draw(0, 0, ' ', 'black', null)
  d.drawText(0, 0, `${ev[0]}, ${ev[1] - 2}`)
}
