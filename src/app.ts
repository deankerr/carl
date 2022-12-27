/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO use window.gameSeed = '111' / localStorage
import { CONFIG } from './config'
import { createDisplay } from './util/display'
import * as ROT from 'rot-js'
import { Keys } from './util/Keys'

let display: ROT.Display
const keys: Keys = new Keys()

// game
import { Game } from './Game'

// dungeon 4
import { createDungeon4, history, Dungeon4Data, modulesAvailable } from './Generate/dungeon4'
import { visualizer4, Visualizer4 } from './Generate/visualizer4'

// Dungeon 4
let visual4: Visualizer4
let d4data: Dungeon4Data | null
const d4modules = mrModules()

// For handling running things like dungeon visualizers/experiments without messing up Game()
export function app() {
  // main display
  display = createDisplay()
  window.display = [display]

  // keys.add(inputD4)

  // ROT.RNG.setSeed(1111)

  switch (CONFIG.appInitial) {
    case 'game2':
      createGame2()
      break
    case 'dungeon4':
      startdungeon4()
      break
    case 'game':
      if (d4data) startgame(d4data)
      break
    default:
      display.drawText(0, 0, 'Welcome to App! I have nothing to do. (' + CONFIG.appInitial + ')?')
  }

  function inputD4(key: string) {
    switch (key) {
      case 'KeyQ':
        d4modules.next()
        startdungeon4()
        break
      case 'KeyN':
        startdungeon4()
        break
      case 'KeyP':
        if (d4data) startgame(d4data)
        break
      default:
        visual4.control(key)
    }
  }

  function startdungeon4() {
    if (visual4 === undefined) visual4 = visualizer4(display, true, false, false)

    console.log('d4modules.current:', d4modules.current())
    try {
      d4data = createDungeon4({ moduleRoomGen: d4modules.current() })
    } catch (error) {
      console.groupEnd()
      console.groupEnd()
      console.groupEnd()
      console.groupEnd()
      console.error(error)
    } finally {
      visual4.start(history, d4modules.current())
    }
  }

  function startgame(d4data: Dungeon4Data) {
    // clean up
    if (keys) {
      keys.cleanup()
    }
    visual4.cleanup()

    // const game = Game(display)
    // game.newWorld(d4data)
    // window.game = game
  }
}

function createGame2() {
  if (keys) keys.cleanup
  window.game = new Game(display)
}

// Module handler
function mrModules() {
  const modules = modulesAvailable
  let index = 0

  const current = () => {
    return modules[index]
  }

  const next = () => {
    index++
    if (index > modules.length - 1) index = 0
    return modules[index]
  }

  return { next, current }
}

declare global {
  interface Window {
    game: object
    display: ROT.Display[]
  }
}
