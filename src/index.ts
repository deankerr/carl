import fontURL from '../assets/Inconsolata.otf'
import { app } from './app'

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

  app()
}
