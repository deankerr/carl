import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { oryxTinyFontMap, oryxTinyMap, tileMapOryxMain } from './tilemap'

const tinySize = 48
export const createTile2Display = () => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width: CONFIG.mainDisplayWidth,
    height: CONFIG.mainDisplayHeight,
    tileWidth: tinySize,
    tileHeight: tinySize,
    tileSet: window.oryxTiny,
    tileColorize: true,
    tileMap: oryxTinyMap,
  })

  return display
}

const msgTileSize = 32
export const createMessageDisplay = () => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width: CONFIG.messageDisplayWidth,
    height: CONFIG.messageDisplayHeight,
    bg: 'transparent',
    tileWidth: msgTileSize,
    tileHeight: msgTileSize,
    tileSet: window.tileSet32,
    tileMap: tileMapOryxMain,
  })

  // debug
  // for (let i = 0; i < CONFIG.messageDisplayHeight; i++) {
  //   display.drawText(0, i, 'JELLY')
  //   display.drawText(CONFIG.messageDisplayWidth - 5, i, 'JELLY')
  // }

  return display
}

export const createTextDisplay = () => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width: CONFIG.textDisplayWidth,
    height: CONFIG.textDisplayHeight,
    bg: 'transparent',
    tileWidth: 24,
    tileHeight: 28,
    tileSet: window.oryxTinyFont24,
    tileMap: oryxTinyFontMap(24, 28),
  })

  // debug
  // for (let i = 0; i < CONFIG.textDisplayHeight; i++) {
  //   display.drawText(CONFIG.textDisplayWidth - 5, i, 'HELLO')
  //   display.drawText(0, i, 'HELLO')
  // }

  return display
}

export const createHTMLWrapper = () => {
  const body = document.body
  body.style.backgroundColor = CONFIG.htmlBackgroundColor
  body.style.margin = '0'
  body.style.padding = '0'
  body.style.height = '100vh'
  body.style.boxSizing = 'border-box'
  body.style.display = 'flex'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.display = 'flex'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'
  document.body.appendChild(wrapper)
  return wrapper
}

export const createGameDisplay = () => {
  const wrapper = createHTMLWrapper()

  // main game display canvas
  const mainDisplay = createTile2Display()
  const main = mainDisplay.getContainer()
  if (!main) throw new Error('Unable to get mainDisplay container')
  main.style.maxWidth = '99vw'
  main.style.maxHeight = '99vh'

  // message display canvas
  const msgDisplay = createMessageDisplay()
  const msg = msgDisplay.getContainer()
  if (!msg) throw new Error('Unable to get msgDisplay container')
  msg.style.maxWidth = '99vw'
  msg.style.maxHeight = '99vh'
  msg.style.position = 'absolute'

  // text display canvas
  const textDisplay = createTextDisplay()
  const textC = textDisplay.getContainer()
  if (!textC) throw new Error('Unable to get textDisplay container')
  textC.style.maxWidth = '99vw'
  textC.style.maxHeight = '99vh'
  textC.style.position = 'absolute'

  wrapper.appendChild(textC)
  wrapper.appendChild(msg)
  wrapper.appendChild(main)

  return [msgDisplay, mainDisplay, textDisplay]
}

export function mouseMove(d: ROT.Display, callback: (ev: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', callback)
  }
}

export function mouseClick(d: ROT.Display, callback: (ev: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousedown', callback)
  }
}
