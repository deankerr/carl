/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { tileMapOryxMessages, tileMapOryxMain } from './tilemap'

const { mainDisplayWidth, mainDisplayHeight, messageDisplayWidth, messageDisplayHeight } = CONFIG

const mainTileSize = 32
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
    tileSet: window.tileSet32,
    tileColorize: true,
    tileMap: tileMapOryxMain,
  })

  return display
}

const msgTileSize = 24
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
    tileSet: window.tileSet24,
    tileColorize: true,
    tileMap: tileMapOryxMessages,
  })

  return display
}

export const createHTMLWrapper = () => {
  const body = document.body
  body.style.backgroundColor = CONFIG.backgroundColor
  body.style.margin = '0'
  body.style.padding = '0'
  body.style.boxSizing = 'border-box'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'

  const wrapper = document.createElement('div')
  wrapper.id = 'wrapper'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.aspectRatio = `${mainDisplayWidth + 2.2} / ${messageDisplayHeight + mainDisplayHeight}`
  wrapper.style.height = '100vh'
  wrapper.style.maxWidth = '100vw'
  wrapper.style.justifyContent = 'center'
  wrapper.style.alignItems = 'center'

  return wrapper
}

export const createGameDisplay = () => {
  const wrapper = createHTMLWrapper()

  // message display canvas
  const msg = createMessageDisplay(messageDisplayWidth, messageDisplayHeight)
  const msgContainer = msg.getContainer()!
  msgContainer.style.width = '100%'
  wrapper.appendChild(msgContainer)

  // main game display canvas
  const main = createTileDisplay(mainDisplayWidth, mainDisplayHeight)
  const mainContainer = main.getContainer()!
  mainContainer.style.width = '100%'
  wrapper.appendChild(mainContainer)

  document.body.appendChild(wrapper)
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
