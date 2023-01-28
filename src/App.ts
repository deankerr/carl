// Initial set up/loading test modules
import { CONFIG } from './config'
import { createGameDisplay } from './lib/display'
import * as ROT from 'rot-js'

import { Game } from './Core/Game'
import { PointManager } from './Model/Point'
import { Entity } from './Core/Entity'
import { Terrain } from './Templates'

export function App() {
  // dev html background
  document.body.style.backgroundColor = CONFIG.htmlBackgroundColor

  if (CONFIG?.seed) ROT.RNG.setSeed(CONFIG.seed)

  window.points = new PointManager()
  const [msg, main] = createGameDisplay()
  window.game = new Game(main, msg)
}

declare global {
  interface Window {
    game: Game
    points: PointManager
  }
}
