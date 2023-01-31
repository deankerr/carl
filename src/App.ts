// Initial set up/loading test modules
import { CONFIG } from './config'

import * as ROT from 'rot-js'
import { Engine } from './Core/Engine'

export function App() {
  document.body.style.backgroundColor = CONFIG.htmlBackgroundColor

  if (CONFIG?.seed) ROT.RNG.setSeed(CONFIG.seed)
  const engine = new Engine()
  window.game = engine

  engine.init()
  engine.render()
}

declare global {
  interface Window {
    game: Engine
  }
}
