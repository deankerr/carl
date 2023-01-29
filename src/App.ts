// Initial set up/loading test modules
import { CONFIG } from './config'

import * as ROT from 'rot-js'
import { Engine } from './Core/Engine'

export function App() {
  document.body.style.backgroundColor = CONFIG.htmlBackgroundColor

  if (CONFIG?.seed) ROT.RNG.setSeed(CONFIG.seed)

  window.game = new Engine()
  window.game.init()
}

declare global {
  interface Window {
    game: Engine
  }
}
