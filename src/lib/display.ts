/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { tileMapOryx16, tileMapOryxClassic } from './tilemap'

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

const msgTileSize = 16
export const createMessageDisplay = (
  width = CONFIG.messageDisplayWidth,
  height = CONFIG.messageDisplayHeight,
  bg = CONFIG.backgroundColor
) => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    bg,
    tileWidth: msgTileSize,
    tileHeight: msgTileSize,
    tileSet: window.tileSet16,
    tileColorize: true,
    tileMap: tileMapOryx16,
  })

  return display
}

export const createGameDisplay = () => {
  const { mainDisplayWidth, mainDisplayHeight, messageDisplayWidth, messageDisplayHeight } = CONFIG
  const wrapper = createHTMLWrapper()

  const msg = createMessageDisplay(messageDisplayWidth, messageDisplayHeight)
  const msgContainer = msg.getContainer()!
  wrapper.appendChild(msgContainer)

  const main = createTileDisplay(mainDisplayWidth, mainDisplayHeight)
  const mainContainer = main.getContainer()!
  wrapper.appendChild(mainContainer)

  return [msg, main]
}

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
