// TODO localStorage key to toggle animate quickly
// TODO visualizer can create its own display, can coexist with game/multiple
// ? TODO Vis reads colour pallette
import * as ROT from 'rot-js'
import { CharMap, RoomGenModule, DEFAULT_CONFIG, modules, ModuleTypesEnum } from './dungeon4'

export type Visualizer4 = {
  start: (h: CharMap[], module: ModuleTypesEnum) => void
  control: (key: string) => void
  cleanup: () => void
}

// TODO fix this config mess
let d: ROT.Display
let history: CharMap[]
let index = -1
let last: number
let animating = false
let nextFrame: number

let currentModule: ModuleTypesEnum

// config
let animate = true
const speed = 'test' // demo | fast | calm | test
const showAnimTag = true

// todo stopRooms, stopCorrs?
const CONFIG = {
  skipRooms: false,
  skipCorrs: false,
}

let corrStartIndex = 0

export function visualizer4(display: ROT.Display, anim: boolean, skipRooms = false, skipCorrs = false): Visualizer4 {
  console.log(`Visualizer4 (playback speed: ${speed})`)
  d = display
  animate = anim
  CONFIG.skipRooms = skipRooms
  CONFIG.skipCorrs = skipCorrs

  // coords display
  const ctx = display.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', mouse)
  }

  return { start, control, cleanup }
}

function start(h: CharMap[], module: ModuleTypesEnum) {
  stop()
  history = h
  currentModule = module
  index = 0

  last = history.length - 1

  corrStartIndex = history.findIndex((h) => h[0][1] === 'corrstart')
  if (corrStartIndex === -1) {
    console.warn('Visualizer: could not find corrstart index')
  }

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

  if (CONFIG.skipRooms && index < corrStartIndex) index = corrStartIndex

  if (CONFIG.skipCorrs && index === corrStartIndex) {
    render(last)
    return
  }

  const tag = history[index][0][1]
  const speedTag = speedMap[speed][tag]
  if (!speedTag) console.warn(`[Vis4] Unrecognised tag: "${tag}"`, index)
  nextFrame = setTimeout(play, speedTag ? speedTag : speedMap[speed]['default'])
}

export function stop() {
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
        // ? room colors?
        // if ('0123456789'.includes(char)) color = 'orange'
        d.draw(xi, yi + 1, char, color, null)
      })
    }
  })

  const height = d.getOptions().height
  // Module
  d.drawText(0, height - 2, `[Q] Room Module: ${currentModule}`)

  // Lower controls
  const msg = map[0][0]
  const tag = map[0][1]
  d.drawText(0, 1, `${msg}`) // no tag
  showAnimTag && d.drawText(0, 1, `${index}-${tag}| ${msg}`) // playbackspeed tag
  d.drawText(0, height - 1, '[SPACE]: Play/Pause, [LEFT/RIGHT]: Step, [N] New, [R] Replay [P]: Play Map')
}

const colorMap: { [key: string]: string } = {
  x: 'red',
  f: 'cyan',
  F: 'lime',
  C: 'cyan',
  p: 'yellow',
  '+': 'saddlebrown',
  c: '#CCC',
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'green',
  5: 'blue',
  6: 'indigo',
  7: 'violet',
  8: 'lime',
  9: 'cyan',
  0: 'silver',
  '✓': 'lime',
  '|': 'white',
  '-': 'white',
}

function control(key: string) {
  switch (key) {
    case 'Space':
      // stop/replay
      if (animating || index === last) {
        stop()
        break
      }
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
    case 'KeyR':
      // replay
      stop()
      index = 0
      animating = true
      play()
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
  d.draw(80, 0, ' ', 'black', null)
  d.draw(79, 0, ' ', 'black', null)
  d.draw(78, 0, ' ', 'black', null)
  d.draw(76, 0, ' ', 'black', null)
  d.draw(75, 0, ' ', 'black', null)
  d.draw(74, 0, ' ', 'black', null)
  d.draw(73, 0, ' ', 'black', null)
  d.drawText(73, 0, `${ev[0]}, ${ev[1] - 2}`)
}

function cleanup() {
  stop()
  d = new ROT.Display()
}

// TODO this is too much
type SpeedMap = { [key: string]: number }

const test: SpeedMap = {
  default: 200,
  tag: 200,
  roomfail: 40,
  roomsuccess: 150,
  corrstart: 1250,
  corrsuccess: 1500,
  flood: 10,
  floodhit: 600,
  path: 10,
  pathfail: 1500,
  pathtarget: 1500,
  shift: 75,
  bsp: 500,
  bspsuccess: 800,
}

const fast: SpeedMap = {
  default: 200,
  tag: 200,
  roomfail: 30,
  roomsuccess: 100,
  corrstart: 500,
  corrsuccess: 1000,
  flood: 10,
  floodhit: 200,
  path: 10,
  pathfail: 1000,
  pathtarget: 1000,
  shift: 50,
  bsp: 100,
  bspsuccess: 500,
}

const demo: SpeedMap = {
  default: 200,
  tag: 200,
  roomfail: 40,
  roomsuccess: 150,
  corrstart: 1250,
  corrsuccess: 1000,
  flood: 10,
  floodhit: 600,
  path: 10,
  pathfail: 1500,
  pathtarget: 1500,
  shift: 100,
  bsp: 400,
  bspsuccess: 1200,
}

const calm: SpeedMap = {
  default: 200,
  tag: 200,
  roomfail: 200,
  roomsuccess: 400,
  corrstart: 2000,
  corrsuccess: 2000,
  flood: 200,
  floodhit: 1500,
  path: 200,
  pathfail: 2000,
  pathtarget: 2000,
  shift: 100,
  bsp: 800,
  bspsuccess: 1100,
}

const speedMap = { fast, demo, calm, test }
