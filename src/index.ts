import fontURL from '../assets/Inconsolata.otf'
import { CONFIG } from './config'
import { app } from './app'
import { createDisplay } from './util/display'

console.log('it begins')
const font = new FontFace('Inconsolata', `url(${fontURL})`)
document.fonts.add(font)

font.load().catch((error) => {
  console.log('Unable to load font: ', error)
})

font.loaded.then(init)

function init() {
  if (window.game) {
    console.log('One is enough')
    return
  }

  const display = createDisplay()

  app(display)
}

declare global {
  interface Window {
    game: object
    app: object
  }
}
