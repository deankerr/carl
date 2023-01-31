import * as ROT from 'rot-js'
import { CONFIG } from './config'
import { logger } from './lib/logger'
import { Engine } from './Core/Engine'

export function App() {
  const log = logger('app', 'init')
  document.body.style.backgroundColor = CONFIG.htmlBackgroundColor

  if (CONFIG?.seed) ROT.RNG.setSeed(CONFIG.seed)
  const engine = new Engine()
  window.game = engine

  engine.init()
  engine.render()

  log.end()
}

declare global {
  interface Window {
    game: Engine
  }
}
