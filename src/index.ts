import tileSet32URL from '../assets/oryx32.png'
import oryxTinyURL from '../assets/oryxTiny.png'
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

function init() {
  if (window.game) {
    console.log('One is enough')
    return
  }

  if (tileSet32Loaded && oryxTinyLoaded) App()
}

declare global {
  interface Window {
    tileSet32: HTMLImageElement
    oryxTiny: HTMLImageElement
  }
}
