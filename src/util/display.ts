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

  resizeTileSetDisplay(display, width, height)

  window.addEventListener('resize', () => {
    resizeTileSetDisplay(display, width, height)
  })

  const c = display.getContainer()
  if (c) document.body.appendChild(c)
  else throw new Error('Unable to get ROT.Display container')

  return display
}

const resizeTileSetDisplay = (display: ROT.Display, width: number, height: number) => {
  const maxW = document.documentElement.clientWidth
  const maxH = document.documentElement.clientHeight
  const dWidth = maxW - 60
  const dHeight = maxH - 30

  const debugMsg = `w: ${document.documentElement.clientWidth}/${dWidth} h: ${
    document.documentElement.clientHeight
  }/${dHeight} comp: ${display.computeSize(width, height)}`
  display.drawText(0, display.getOptions().height - 1, debugMsg)

  const c = display.getContainer()
  if (c && 'style' in c) {
    // c.style.width = `${dWidth}px`
    c.style.height = `${dHeight}px`
  }
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
  ...mapTiles(letters, 480, 80),
  ...mapTiles(letters.toLowerCase(), 480, 80),
  ...mapTiles(numbers, 560, 80),
  ...mapTiles(punctuation, 400, 80),
  ' ': [960, 0],
  '{O}#': [0, 160],
  '{O}.': [640, 160],
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
