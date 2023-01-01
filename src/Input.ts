// * Translate key code into Action

// import { Move, Direction, Wait, UI, ChangeLevel } from './Actions'
import { ActionTypes, Move, UI } from './Actions'
import { Direction } from './util/direction'

export function input(code: string): ActionTypes {
  // console.log('input code', code)
  switch (code) {
    // Movement
    case 'Numpad7':
      return Move(Direction.NW)
    case 'ArrowUp':
    case 'Numpad8':
      return Move(Direction.N)
    case 'Numpad9':
      return Move(Direction.NE)
    case 'ArrowLeft':
    case 'Numpad4':
      return Move(Direction.W)
    case 'Numpad5':
      return Move(Direction.WAIT)
    case 'ArrowRight':
    case 'Numpad6':
      return Move(Direction.E)
    case 'Numpad1':
      return Move(Direction.SW)
    case 'ArrowDown':
    case 'Numpad2':
      return Move(Direction.S)
    case 'Numpad3':
      return Move(Direction.SE)

    // UI
    case 'KeyL':
      return UI('toggleLightSwitch')
    // case 'KeyN':
    //   return UI('newMap')

    // Utility
    default:
      console.log(`Key '${code}' not recognised`)
      return null
  }
}
