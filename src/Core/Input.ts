// * Translate key code into Action

// import { Move, Direction, Wait, UI, ChangeLevel } from './Actions'
import { ActionTypes, move, UI } from '../Action'
import { Direction } from '../util/direction'

export function input(code: string): ActionTypes {
  // console.log('input code', code)
  switch (code) {
    // Movement
    case 'Numpad7':
      return move(Direction.NW)
    case 'ArrowUp':
    case 'Numpad8':
      return move(Direction.N)
    case 'Numpad9':
      return move(Direction.NE)
    case 'ArrowLeft':
    case 'Numpad4':
      return move(Direction.W)
    case 'Numpad5':
      return move(Direction.WAIT)
    case 'ArrowRight':
    case 'Numpad6':
      return move(Direction.E)
    case 'Numpad1':
      return move(Direction.SW)
    case 'ArrowDown':
    case 'Numpad2':
      return move(Direction.S)
    case 'Numpad3':
      return move(Direction.SE)

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
