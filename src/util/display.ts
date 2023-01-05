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

export const createTileSetDisplay = (width = CONFIG.TSDisplayWidth, height = CONFIG.TSDisplayHeight) => {
  // const wrapper = document.createElement('div')
  // wrapper.style.display = 'flex'
  // wrapper.style.alignItems = 'center'
  // wrapper.style.justifyContent = 'center'
  // // wrapper.style.width = '100%'
  // wrapper.style.height = '90%'
  // wrapper.style.border = '1px dotted red'

  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    // bg: 'black',
    tileWidth: 40, // oryx-classic
    tileHeight: 40,
    tileSet: window.tileSet,
    tileColorize: true,
    tileMap: tileMapOryxClassic,
  })

  // resizeTileSetDisplay(display)

  // window.addEventListener('resize', () => {
  //   resizeTileSetDisplay(display)
  // })

  const wrapper = document.getElementById('wrapper')
  const c = display.getContainer()
  if (c && wrapper) {
    // wrapper.appendChild(c)
    wrapper.appendChild(c)
  } else throw new Error('Unable to get ROT.Display container')

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
  ...mapTiles(letters, 240, 40),
  ...mapTiles(letters.toLowerCase(), 320, 40),
  ...mapTiles(numbers, 280, 40),
  ...mapTiles(punctuation, 200, 40),
  "'": [1040, 320],
  ' ': [480, 0],
  'O^#': [0, 80],
  'O^.': [320, 80],
  'O^.0': [360, 80],
  'O^.1': [400, 80],
  'O^.2': [480, 80],
  'O^.3': [480, 80],
  'O^+': [520, 80],
  'O^/': [560, 80],
  'O^o': [480, 120],
  'O^x': [240, 120],
  'O^s': [320, 120],
  'O^t': [760, 120],
  'O^r': [400, 120],
  'O^g': [880, 120],
  'O^D': [160, 120],
  'O^H': [440, 120],
  'O^S': [200, 120],
  'O^c': [720, 120],
  'O^a': [840, 120],
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
