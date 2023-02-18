import tileSet32URL from '../assets/oryx32.png'
import oryxTinyURL from '../assets/oryxTiny.png'
import oryxTinyFont24URL from '../assets/oryxTinyFont24.png'
import { App } from './App'

console.log('it begins')

let tileSet32Loaded = false
const tileSet32 = new Image()
tileSet32.src = tileSet32URL
tileSet32.onload = () => {
  window.tileSet32 = tileSet32
  tileSet32Loaded = true
  init()
}

let oryxTinyLoaded = false
const oryxTiny = new Image()
oryxTiny.src = oryxTinyURL
oryxTiny.onload = () => {
  window.oryxTiny = oryxTiny
  oryxTinyLoaded = true
  init()
}

let oryxTinyFont24Loaded = false
const oryxTinyFont24 = new Image()
oryxTinyFont24.src = oryxTinyFont24URL
oryxTinyFont24.onload = () => {
  window.oryxTinyFont24 = oryxTinyFont24
  oryxTinyFont24Loaded = true
  init()
}

function init() {
  if (window.game) {
    console.log('One is enough')
    return
  }

  if (tileSet32Loaded && oryxTinyLoaded && oryxTinyFont24Loaded) App()
}

declare global {
  interface Window {
    tileSet32: HTMLImageElement
    oryxTiny: HTMLImageElement
    oryxTinyFont24: HTMLImageElement
  }
}
