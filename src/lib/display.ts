/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { tileMapOryxMessages, tileMapOryxMain } from './tilemap'

export const createHTMLWrapper = () => {
  const body = document.body
  body.style.backgroundColor = '#191919'
  body.style.margin = '0'
  body.style.padding = '0'
  body.style.boxSizing = 'border-box'
  body.style.height = '100vh'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.justifyContent = 'center'
  wrapper.style.backgroundColor = 'linen'

  return wrapper
}

const mainTileSize = 24
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
    tileWidth: mainTileSize,
    tileHeight: mainTileSize,
    tileSet: window.tileSet24,
    tileColorize: true,
    tileMap: tileMapOryxMain,
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
    tileMap: tileMapOryxMessages,
  })

  return display
}

export const createGameDisplay = () => {
  const { mainDisplayWidth, mainDisplayHeight, messageDisplayWidth, messageDisplayHeight } = CONFIG
  const host = createHTMLWrapper()

  const msg = createMessageDisplay(messageDisplayWidth, messageDisplayHeight)
  const msgContainer = msg.getContainer()!
  const main = createTileDisplay(mainDisplayWidth, mainDisplayHeight)
  const mainContainer = main.getContainer()!

  msgContainer.style.aspectRatio = `${messageDisplayWidth / messageDisplayHeight}`

  mainContainer.style.aspectRatio = `${mainDisplayWidth / mainDisplayHeight}`
  mainContainer.style.height = '82vh'

  host.appendChild(msgContainer)
  host.appendChild(mainContainer)
  document.body.appendChild(host)
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
