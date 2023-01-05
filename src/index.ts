import fontURL from '../assets/Inconsolata.otf'
import tileSetURL from '../assets/oryx_classic_lc4.png'
import { App } from './App'

console.log('it begins')

let fontLoaded = false
const font = new FontFace('Inconsolata', `url(${fontURL})`)
document.fonts.add(font)

font.load().catch((error) => {
  console.log('Unable to load font: ', error)
})

font.loaded.then(() => {
  fontLoaded = true
  init()
})

let tileSetLoaded = false
const tileSet = new Image()
tileSet.src = tileSetURL
tileSet.onload = () => {
  window.tileSet = tileSet
  tileSetLoaded = true
  init()
}

function init() {
  if (window.game) {
    console.log('One is enough')
    return
  }

  if (fontLoaded && tileSetLoaded) App()
}
