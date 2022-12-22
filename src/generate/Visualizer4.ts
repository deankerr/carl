// TODO finalize structure - class? how to create then destroy object easily
import * as ROT from 'rot-js'
import { CharMap } from './Dungeon4'

let d: ROT.Display | null
let history: CharMap[]
let index = -1
let last: number
let animating = true

const debugid = ROT.RNG.getUniformInt(1000, 9999)

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
  path: 50,
  pathfail: 1000,
  pathtarget: 1000,
  shift: 50,
}

export function Visualizer4(display: ROT.Display, h: CharMap[]) {
  console.log('Visualizer4', debugid)
  d = display
  history = h
  last = history.length - 1

  // coords viewer
  const ctx = display.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', mouse)
  }

  if (animating) {
    play()
  } else {
    index = last
    render(index)
  }

  return { control, cleanup }
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
  d?.clear()
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
        if (char === '+') color = 'saddlebrown'
        d?.draw(xi, yi + 1, char, color, null)
      })
    }
  })

  const msg = map[0][0]
  const group = map[0][1]
  d?.drawText(0, d.getOptions().height - 2, `[${index}-${group}] ${msg}`)
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
      break
  }
}

function mouse(event: MouseEvent) {
  const dis = d as ROT.Display
  const ev = dis.eventToPosition(event)
  d?.drawText(0, 0, '......')
  d?.drawText(0, 0, `${ev[0]}, ${ev[1] - 2}`)
}

function cleanup() {
  animating = false
  const ctx = d?.getContainer()
  ctx?.removeEventListener('mousemove', mouse)
  d = null
}
