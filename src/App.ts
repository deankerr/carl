// Initial set up/loading test modules
import { CONFIG } from './config'
import { createGameDisplay } from './lib/display'
import * as ROT from 'rot-js'

import { Game } from './Core/Game'
import { PointManager } from './Model/Point'

export function App() {
  // dev html background
  document.body.style.backgroundColor = CONFIG.htmlBackgroundColor

  if (CONFIG?.seed) ROT.RNG.setSeed(CONFIG.seed)

  const [msg, main] = createGameDisplay()
  window.points = new PointManager()
  window.game = new Game(main, msg)
}

declare global {
  interface Window {
    game: Game
    points: PointManager
  }
}
