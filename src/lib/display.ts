/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ROT from 'rot-js'
import { CONFIG } from '../config'

export const createHTMLWrapper = () => {
  const body = document.body
  body.style.backgroundColor = '#191919'
  body.style.margin = '0'
  body.style.padding = '0'
  body.style.boxSizing = 'border-box'
  body.style.width = '100vw'
  body.style.height = '100vh'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.maxWidth = '140vh'
  wrapper.style.maxHeight = '120vw'

  body.appendChild(wrapper)

  return wrapper
}

export const createTileDisplay = (
  width = CONFIG.mainDisplayWidth,
  height = CONFIG.mainDisplayHeight,
  bg = CONFIG.backgroundColor
) => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    bg,
    tileWidth: CONFIG.tileSize, // oryx-classic
    tileHeight: CONFIG.tileSize,
    tileSet: window.tileSet,
    tileColorize: true,
    tileMap: tileMapOryxClassic,
  })

  return display
}

export const createGameDisplay = () => {
  const { mainDisplayWidth, mainDisplayHeight, msgDisplayWidth, msgDisplayHeight } = CONFIG
  const wrapper = createHTMLWrapper()

  const msg = createTileDisplay(msgDisplayWidth, msgDisplayHeight)
  const msgContainer = msg.getContainer()!
  wrapper.appendChild(msgContainer)

  const main = createTileDisplay(mainDisplayWidth, mainDisplayHeight)
  const mainContainer = main.getContainer()!
  wrapper.appendChild(mainContainer)

  return [msg, main]
}

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
  ...mapTiles(letters, 240, 40),
  ...mapTiles(letters.toLocaleLowerCase(), 240, 40),
  // ...mapTiles(letters.toLowerCase(), 320, 40), // lowercase font

  ...mapTiles(numbers, 280, 40),
  ...mapTiles(punctuation, 200, 40),
  "'": [1040, 320],
  ' ': [480, 0],
  'O#': [0, 80],
  'O[': [40, 80],
  'O.': [320, 80],
  'O.0': [360, 80],
  'O.1': [400, 80],
  'O.2': [480, 80],
  'O.3': [480, 80],
  Oo: [480, 120],
  Ox: [240, 120],
  Os: [320, 120],
  Ot: [760, 120],
  Or: [400, 120],
  Og: [880, 120],
  OD: [160, 120],
  OH: [440, 120],
  OS: [200, 120],
  Oc: [720, 120],
  Oa: [840, 120],
  'O+': [520, 80],
  'O/': [560, 80],
  Ov: [80, 0],
  '~': [0, 40],
  'O"': [0, 0],
  'O:': [40, 0],
  'O<': [680, 80],
  'O>': [720, 80],
  OT: [200, 0],
  OM: [280, 0],
  OP: [160, 0],
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

export function displayDebugStrings(display: ROT.Display) {
  const cW = document.documentElement.clientWidth
  console.log('cW:', cW)
  const cH = document.documentElement.clientHeight
  const { width: gW, height: gH } = display.getOptions()

  return [`cW:${cW} gW:${gW} cH:${cH} gH:${gH}`, `cR:${(cW / cH).toFixed(2)} gR:${gW / gH}`]
}

// resizeTileSetDisplay(display)

// window.addEventListener('resize', () => {
//   resizeTileSetDisplay(display)
// })

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
