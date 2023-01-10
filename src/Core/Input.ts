// * Translate key code into Action

// import { Move, Direction, Wait, UI, ChangeLevel } from './Actions'
import { ActionTypes, Move, UI } from '../Action'

export function input(code: string): ActionTypes | null {
  switch (code) {
    // Movement
    case 'Numpad7':
      return Move('NW')
    case 'ArrowUp':
    case 'Numpad8':
      return Move('N')
    case 'Numpad9':
      return Move('NE')
    case 'ArrowLeft':
    case 'Numpad4':
      return Move('W')
    case 'KeyW':
    case 'Numpad5':
      return Move('WAIT')
    case 'ArrowRight':
    case 'Numpad6':
      return Move('E')
    case 'Numpad1':
      return Move('SW')
    case 'ArrowDown':
    case 'Numpad2':
      return Move('S')
    case 'Numpad3':
      return Move('SE')

    // UI
    case 'KeyL':
      return UI('toggleLightSwitch')
    case 'Semicolon':
      return UI('toggleInternalWalls')
    case 'KeyR':
      return UI('render')

    // case 'KeyN':
    //   return UI('newMap')

    // Utility
    default:
      console.log(`Key '${code}' not recognised`)
      return null
  }
}
