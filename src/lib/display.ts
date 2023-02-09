import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { tileMapOryxMain } from './tilemap'

const mainTileSize = 32
export const createTileDisplay = (
  width = CONFIG.mainDisplayWidth,
  height = CONFIG.mainDisplayHeight
) => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width,
    height,
    fg: CONFIG.messageColor,
    bg: CONFIG.mainBackgroundColor,
    tileWidth: mainTileSize,
    tileHeight: mainTileSize,
    tileSet: window.tileSet32,
    tileColorize: true,
    tileMap: tileMapOryxMain,
  })

  return display
}

const msgTileSize = 32
export const createMessageDisplay = () => {
  const display = new ROT.Display({
    layout: 'tile-gl',
    width: CONFIG.messageDisplayWidth,
    height: CONFIG.messageDisplayHeight,
    fg: CONFIG.messageColor,
    bg: CONFIG.messageBackgroundColor,
    tileWidth: msgTileSize,
    tileHeight: msgTileSize,
    tileSet: window.tileSet32,
    tileColorize: true,
    tileMap: tileMapOryxMain,
  })

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
  body.style.flexDirection = 'column'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'
  // wrapper.style.backgroundColor = '#008888'

  return wrapper
}

export const createGameDisplay = () => {
  const wrapper = createHTMLWrapper()

  // message display canvas
  const msgDisplay = createMessageDisplay()
  const msg = msgDisplay.getContainer()
  if (!msg) throw new Error('Unable to get msgDisplay container')

  msg.style.maxWidth = '99vw'
  msg.style.maxHeight = '99vh'
  msg.style.position = 'absolute'

  // main game display canvas
  const mainDisplay = createTileDisplay()
  const main = mainDisplay.getContainer()
  if (!main) throw new Error('Unable to get mainDisplay container')

  main.style.maxWidth = '99vw'
  main.style.maxHeight = '99vh'
  // main.style.minWidth = '98vw'
  // main.style.minHeight = '100%'

  wrapper.appendChild(msg)
  wrapper.appendChild(main)

  document.body.appendChild(wrapper)
  return [msgDisplay, mainDisplay]
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
