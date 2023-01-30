// * Translate key code into Action

// import { Move, Direction, Wait, UI, ChangeLevel } from './Actions'
import { ActionTypes, ChangeLevel, Move, UI } from '../Action'

export function input(code: string): ActionTypes | null {
  switch (code) {
    // Movement
    case 'KeyI':
    case 'Numpad7':
      return Move('NW')
    case 'KeyO':
    case 'ArrowUp':
    case 'Numpad8':
      return Move('N')
    case 'KeyP':
    case 'Numpad9':
      return Move('NE')
    case 'KeyK':
    case 'ArrowLeft':
    case 'Numpad4':
      return Move('W')
    case 'KeyL':
    case 'Numpad5':
      return Move('WAIT')
    case 'Semicolon':
    case 'ArrowRight':
    case 'Numpad6':
      return Move('E')
    case 'Comma':
    case 'Numpad1':
      return Move('SW')
    case 'Period':
    case 'ArrowDown':
    case 'Numpad2':
      return Move('S')
    case 'Slash':
    case 'Numpad3':
      return Move('SE')

    // Change Level
    case 'Enter':
    case 'Space':
      return ChangeLevel('anywhere')
    // Debug change level
    case 'Equal':
      return ChangeLevel('debug_down')
    case 'Minus':
      return ChangeLevel('debug_up')

    // UI
    case 'KeyV':
      return UI('visualizer')
    // debug
    case 'KeyT':
      return UI('toggleLightSwitch')
    case 'KeyR':
      return UI('render')

    // Debug log world
    case 'KeyQ':
      return UI('debug_logworld')
    case 'KeyE':
      return UI('debug_logentities')

    // case 'KeyN':
    //   return UI('newMap')

    // Utility
    default:
      console.log(`Key '${code}' not recognised`)
      return null
  }
}
