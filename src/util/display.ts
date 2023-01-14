import * as ROT from 'rot-js'
import { CONFIG } from '../config'

export const createHTMLWrapper = () => {
  const body = document.body
  body.style.backgroundColor = '#191919'
  body.style.margin = '0'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.margin = '0 auto'
  wrapper.style.display = 'flex'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'
  wrapper.style.width = '98vw'
  wrapper.style.height = '98vh'
  body.appendChild(wrapper)
}

export const createTileSetDisplay = (width = CONFIG.displayWidth, height = CONFIG.displayHeight) => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    bg: '#131313',
    tileWidth: 40, // oryx-classic
    tileHeight: 40,
    tileSet: window.tileSet,
    tileColorize: true,
    tileMap: tileMapOryxClassic,
  })

  const wrapper = document.getElementById('wrapper')
  const c = display.getContainer()
  if (c && wrapper) {
    c.style.maxHeight = '100%'
    c.style.maxWidth = '100%'
    wrapper.appendChild(c)
  } else throw new Error('Unable to get ROT.Display container')

  return display
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
