import { CONFIG } from './config'
import * as ROT from 'rot-js'
import { Keys } from './keys'

// game
import { Game } from './game'

// dungeon 4
import { dungeon4, history, Dungeon4Data } from './generate/dungeon4'
import { visualizer4, Visualizer4 } from './generate/visualizer4'

let display: ROT.Display
const keys: Keys = new Keys()

let visual4: Visualizer4
let d4data: Dungeon4Data

// For handling running things like dungeon visualizers/experiements without messing up Game()
export function app(d: ROT.Display) {
  display = d
  keys.add(input)

  switch (CONFIG.appInitial) {
    case 'dungeon4':
      startdungeon4()
      break
    case 'game':
      startgame(d4data)
      break
    default:
      display.drawText(0, 0, 'Welcome to App! I have nothing to do.')
  }

  function input(key: string) {
    switch (key) {
      case 'KeyN':
        startdungeon4()
        break
      case 'KeyP':
        startgame(d4data)
        break
      default:
        visual4.control(key)
    }
  }

  function startdungeon4() {
    if (visual4 === undefined) visual4 = visualizer4(display)
    try {
      d4data = dungeon4(CONFIG.levelWidth, CONFIG.levelHeight)
    } finally {
      visual4.start(history)
    }
  }

  function startgame(d4data: Dungeon4Data) {
    // clean up
    if (keys) {
      keys.cleanup()
    }
    visual4.cleanup()

    const game = Game(display)
    game.newWorld(d4data)
    window.game = game
  }
}

declare global {
  interface Window {
    game: object
  }
}
