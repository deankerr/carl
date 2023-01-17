import tileSet24URL from '../assets/oryx24.png'
import tileSet32URL from '../assets/oryx32.png'
import { App } from './App'

console.log('it begins')

let tileSet24Loaded = false
const tileSet24 = new Image()
tileSet24.src = tileSet24URL
tileSet24.onload = () => {
  window.tileSet24 = tileSet24
  tileSet24Loaded = true
  init()
}

let tileSet32Loaded = false
const tileSet32 = new Image()
tileSet32.src = tileSet32URL
tileSet32.onload = () => {
  window.tileSet32 = tileSet32
  tileSet32Loaded = true
  init()
}

function init() {
  if (window.game) {
    console.log('One is enough')
    return
  }

  if (tileSet24Loaded && tileSet32Loaded) App()
}

declare global {
  interface Window {
    tileSet24: HTMLImageElement
    tileSet32: HTMLImageElement
  }
}
