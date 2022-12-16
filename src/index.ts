import fontURL from '../assets/Inconsolata.otf'
import * as ROT from 'rot-js'
// import { Game } from './game'
import { visgen } from './generate/visgen'
import { CONFIG } from './config'
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

  const display = new ROT.Display({
    width: CONFIG.displayWidth,
    height: CONFIG.displayHeight,
    fontFamily: 'Inconsolata',
    // fontSize: 28,

    // forceSquareRatio: true,
  })
  resize()
  window.addEventListener('resize', resize)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.body.appendChild(display.getContainer()!)

  // Game(display)
  visgen(display)

  function resize() {
    const screenW = document.documentElement.clientWidth
    const screenH = document.documentElement.clientHeight
    const compSize = display.computeFontSize(screenW, screenH)
    console.log(`Display size:`, compSize)
    display.setOptions({ fontSize: compSize - 1 })
  }
}

declare global {
  interface Window {
    game: object
  }
}
