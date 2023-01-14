// import fontURL from '../assets/Inconsolata.otf'
import tileSetURL from '../assets/oryx_classic_lc40.png'
import tileSet16URL from '../assets/oryx16.png'
import tileSet24URL from '../assets/oryx24.png'
import tileSet32URL from '../assets/oryx32.png'
import { App } from './App'

console.log('it begins')

// let fontLoaded = false
// const font = new FontFace('Inconsolata', `url(${fontURL})`)
// document.fonts.add(font)

// font.load().catch((error) => {
//   console.log('Unable to load font: ', error)
// })

// font.loaded.then(() => {
//   fontLoaded = true
//   init()
// })

let tileSetLoaded = false
const tileSet = new Image()
tileSet.src = tileSetURL
tileSet.onload = () => {
  window.tileSet = tileSet
  tileSetLoaded = true
  init()
}

let tileSet16Loaded = false
const tileSet16 = new Image()
tileSet16.src = tileSet16URL
tileSet16.onload = () => {
  window.tileSet16 = tileSet16
  tileSet16Loaded = true
  init()
}

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

  if (tileSetLoaded && tileSet16Loaded && tileSet24Loaded && tileSet32Loaded) App()
}
