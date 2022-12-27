import { Move, Direction, Wait, UI, ChangeLevel } from './Actions'
import { NewPlayerPos } from './Actions/NewPlayerPos'

export function input(event: KeyboardEvent) {
  const code = event.code
  switch (code) {
    // Movement
    case 'Numpad7':
      return Move(Direction.NW)
    case 'Numpad8':
      return Move(Direction.N)
    case 'Numpad9':
      return Move(Direction.NE)
    case 'Numpad4':
      return Move(Direction.W)
    case 'Numpad5':
      return Wait()
    case 'Numpad6':
      return Move(Direction.E)
    case 'Numpad1':
      return Move(Direction.SW)
    case 'Numpad2':
      return Move(Direction.S)
    case 'Numpad3':
      return Move(Direction.SE)

    // UI
    case 'KeyL':
      return UI('lightsOn')
    case 'KeyN':
      return UI('newMap')
    case 'KeyO':
      return UI('cellular map step')
    case 'KeyP':
      return UI('cellular map connect')

    // Change level
    case 'Digit1':
    case 'Digit2':
    case 'Digit3':
    case 'Digit4':
    case 'Digit5':
    case 'Digit6':
    case 'Digit7':
    case 'Digit8':
    case 'Digit9':
      return ChangeLevel(parseInt(event.key) - 1)
    case 'Digit0':
      return ChangeLevel(9)

    // Utility
    case 'KeyT':
      return NewPlayerPos()
    default:
      console.log(`Key '${code}' not recognised`)
      return null
  }
}
