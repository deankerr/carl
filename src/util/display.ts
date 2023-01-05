import * as ROT from 'rot-js'
import { CONFIG } from '../config'

export function createDisplay(width = CONFIG.displayWidth, height = CONFIG.displayHeight) {
  const display = new ROT.Display({
    width,
    height,
    fontFamily: 'Inconsolata',
  })

  resize(display)

  window.addEventListener('resize', () => {
    resize(display)
  })

  const container = display.getContainer()
  if (!container) throw new Error('Unable to get ROT.Display container.')

  document.body.appendChild(container)

  return display
}

// Resize display to fill available space
function resize(display: ROT.Display) {
  const screenW = document.documentElement.clientWidth
  const screenH = document.documentElement.clientHeight
  const compSize = display.computeFontSize(screenW, screenH)
  display.setOptions({ fontSize: compSize - 1 })
}

export const createTileSetDisplay = (width: number, height: number) => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    bg: 'black',
    tileWidth: 80, // oryx-classic
    tileHeight: 80,
    tileSet: window.tileSet,
    tileColorize: true,
    tileMap: tileMapOryxClassic,
  })

  // resizeTileSetDisplay(display)

  // window.addEventListener('resize', () => {
  //   resizeTileSetDisplay(display)
  // })

  const c = display.getContainer()
  if (c) document.body.appendChild(c)
  else throw new Error('Unable to get ROT.Display container')

  return display
}

// const resizeTileSetDisplay = (display: ROT.Display) => {
//   const maxW = document.documentElement.clientWidth
//   const maxH = document.documentElement.clientHeight
//   const dWidth = maxW - 60
//   const dHeight = maxH - 30

//   // display debug
//   const yMax = display.getOptions().height - 1
//   const ddb = displayDebugStrings(display)

//   display.drawText(0, yMax - 1, ddb[0])
//   display.drawText(0, yMax, ddb[1])

//   const c = display.getContainer()
//   if (c && 'style' in c) {
//     // c.style.width = `${dWidth}px`
//     c.style.height = `${dHeight}px`
//   }
// }

// get a range of tiles in the ROT format
const mapTiles = (chars: string, y: number, tileWidth: number) => {
  return chars.split('').reduce((acc, curr, i) => {
    return (acc = { ...acc, [curr]: [tileWidth * i, y] })
  }, {})
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const punctuation = '!@#$%^&*()-=+.,:;"<>?\\/|-:'
const numbers = '1234567890'

const tileMapOryxClassic = {
  ...mapTiles(letters, 480, 80),
  ...mapTiles(letters.toLowerCase(), 640, 80),
  ...mapTiles(numbers, 560, 80),
  ...mapTiles(punctuation, 400, 80),
  "'": [2080, 640],
  ' ': [960, 0],
  'O^#': [0, 160],
  'O^.': [640, 160],
  'O^.0': [720, 160],
  'O^.1': [800, 160],
  'O^.2': [880, 160],
  'O^.3': [960, 160],
  'O^+': [1040, 160],
  'O^/': [1120, 160],
  'O^o': [960, 240],
  'O^x': [480, 240],
  'O^s': [640, 240],
  'O^t': [1520, 240],
  'O^r': [800, 240],
  'O^g': [1760, 240],
  'O^D': [320, 240],
  'O^H': [880, 240],
  'O^S': [400, 240],
  'O^c': [1440, 240],
  'O^a': [1680, 240],
} satisfies { [key: string]: [number, number] }

export function mouseMove(d: ROT.Display, callback: (event: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', callback)
  }
}

export function mouseClick(d: ROT.Display, callback: (event: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousedown', callback)
  }
}

// export function displayDebugStrings(display: ROT.Display) {
//   const cW = document.documentElement.clientWidth
//   console.log('cW:', cW)
//   const cH = document.documentElement.clientHeight
//   const { width: gW, height: gH } = display.getOptions()

//   return [`cW: ${cW} gW: ${gW} cH: ${cH} gW: ${gH}`, `cR: ${cW / cH} gR: ${gW / gH}`]
// }
