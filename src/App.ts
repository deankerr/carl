// Initial set up/loading test modules
// TODO use window.gameSeed = '111' / localStorage
import { CONFIG } from './config'
import { createDisplay, createTileSetDisplay } from './util/display'
import * as ROT from 'rot-js'
import { Keys } from './util/Keys'

let display: ROT.Display
const keys: Keys = new Keys()

// game
import { Game } from './Core/Game'

// dungeon 4
import { create, history, Dungeon4Data, modulesAvailable } from './Generate/dungeon4/dungeon4'
import { visualizer4, Visualizer4 } from './Generate/visualizer4'

// Dungeon 4
let visual4: Visualizer4
let d4Data: Dungeon4Data | null
const d4modules = mrModules()

// TODO live display switching

export function App() {
  // main display
  display = CONFIG.useTileset
    ? createTileSetDisplay(CONFIG.displayWidthTileset, CONFIG.displayHeightTileset)
    : createDisplay(CONFIG.displayWidthText, CONFIG.displayHeightText)
  window.display = [display]

  // dev html background
  document.body.style.backgroundColor = CONFIG.htmlBGColor

  if (CONFIG.seed) ROT.RNG.setSeed(CONFIG.seed)

  switch (CONFIG.appInitial) {
    case 'game':
      startGame()
      break
    case 'dungeon4':
      keys.add(inputD4)
      startDungeon4()
      break
    default:
      display.drawText(0, 0, 'Welcome to App! I have nothing to do. (' + CONFIG.appInitial + ')?')
  }

  function inputD4(key: string) {
    switch (key) {
      case 'KeyQ':
        d4modules.next()
        startDungeon4()
        break
      case 'KeyN':
        startDungeon4()
        break
      case 'KeyP':
        if (d4Data) startGame(d4Data)
        break
      default:
        visual4.control(key)
    }
  }

  function startDungeon4() {
    if (visual4 === undefined) visual4 = visualizer4(display, true, false, false)

    console.log('d4modules.current:', d4modules.current())
    try {
      d4Data = create({ moduleRoomGen: d4modules.current() })
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

  function startGame(d4Data?: Dungeon4Data) {
    if (keys) keys.cleanup()
    if (visual4) visual4.cleanup()
    window.game = new Game(display, d4Data)
  }
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
    tileSet: HTMLImageElement
  }
}
