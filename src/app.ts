// TODO use window.gameSeed = '111' / localStorage
import { CONFIG } from './config'
import * as ROT from 'rot-js'
import { Keys } from './keys'

// game
import { Game } from './game'

// dungeon 4
import {
  dungeon4,
  history,
  Dungeon4Data,
  modules,
  moduleDefault,
  ModuleTypesEnum,
  modulesAvailable,
} from './generate/dungeon4'
import { visualizer4, Visualizer4 } from './generate/visualizer4'

let display: ROT.Display
const keys: Keys = new Keys()

// Dungeon 4
let visual4: Visualizer4
let d4data: Dungeon4Data | null
// let moduleName = moduleDefault
// let moduleName = ModuleTypesEnum.Classic
let currentModule = moduleDefault
let modulesAvailableIndex = 0
const dung4mods = [ModuleTypesEnum.BSP, ModuleTypesEnum.Classic]
let dung4modsIndex = 0

// For handling running things like dungeon visualizers/experiments without messing up Game()
export function app(d: ROT.Display) {
  display = d
  keys.add(input)

  // ROT.RNG.setSeed(1111)

  switch (CONFIG.appInitial) {
    case 'dungeon4':
      startdungeon4(currentModule)
      break
    case 'game':
      if (d4data) startgame(d4data)
      break
    default:
      display.drawText(0, 0, 'Welcome to App! I have nothing to do.')
  }

  function input(key: string) {
    switch (key) {
      case 'KeyQ':
        dung4modsIndex++
        if (dung4modsIndex > dung4mods.length - 1) dung4modsIndex = 0
        currentModule = dung4mods[dung4modsIndex]
        startdungeon4(currentModule)
        break
      case 'KeyN':
        startdungeon4(currentModule)
        break
      case 'KeyP':
        if (d4data) startgame(d4data)
        break
      default:
        visual4.control(key)
    }
  }

  function startdungeon4(module: ModuleTypesEnum) {
    if (visual4 === undefined) visual4 = visualizer4(display, true, false, false)
    try {
      d4data = dungeon4({ moduleRoomGen: module })
    } catch (error) {
      console.groupEnd()
      console.groupEnd()
      console.groupEnd()
      console.groupEnd()
      console.error(error)
    } finally {
      visual4.start(history, currentModule)
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
