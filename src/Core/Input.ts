// * Translate key code into Action

import { GameContext } from '.'
import { logger } from '../lib/logger'
import { ActionTypes, Move, MetaUI, ChangeRegion, ChangeZone, Visualize, UsePortal } from './Action'

type KeyMap = Record<string, ActionTypes>

export function handle(event: KeyboardEvent, context: GameContext): ActionTypes | undefined {
  const { code, ctrlKey: ctrl, metaKey: meta, shiftKey: shift } = event
  // console.log('event:', event)
  const k = `${ctrl || meta ? 'ctrl ' : ''}${shift ? 'shift ' : ''}${code}`

  // movement
  const move: KeyMap = {
    Numpad7: Move('NW'),
    Numpad8: Move('N'),
    Numpad9: Move('NE'),
    Numpad4: Move('W'),
    KeyW: Move('WAIT'),
    Numpad5: Move('WAIT'),
    Numpad6: Move('E'),
    Numpad1: Move('SW'),
    Numpad2: Move('S'),
    Numpad3: Move('SE'),
    'ctrl ArrowLeft': Move('SW'),
    ArrowLeft: Move('W'),
    'shift ArrowLeft': Move('NW'),
    'ctrl ArrowRight': Move('SE'),
    ArrowRight: Move('E'),
    'shift ArrowRight': Move('NE'),
    ArrowDown: Move('S'),
    ArrowUp: Move('N'),
  }
  if (move[k]) return move[k]

  const gameKeys: KeyMap = {
    'shift Comma': ChangeRegion('up'),
    'shift Period': ChangeRegion('down'),
    Comma: UsePortal(),
    Period: UsePortal(),
    KeyV: Visualize('init'),
    // debug
    'shift Digit1': ChangeZone(0),
    'shift Digit2': ChangeZone(1),
    'shift Digit3': ChangeZone(2),
    'shift Digit4': ChangeZone(3),
    'shift Digit5': ChangeZone(4),
    'shift Digit6': ChangeZone(5),
    'shift Digit7': ChangeZone(6),
    'shift Digit8': ChangeZone(7),
    'shift Digit9': ChangeZone(8),
    'shift KeyR': MetaUI('revealAll'),
    'shift KeyL': MetaUI('animation'),
    'shift KeyQ': MetaUI('logWorld'),
    Digit9: MetaUI('displayRegion'),
    Digit0: MetaUI('displayDefault'),
    Minus: MetaUI('displayZoomOut'),
    Equal: MetaUI('displayZoomIn'),
    Backquote: MetaUI('debugMode'),
    'shift Backquote': MetaUI('logTile'),
  }
  if (context === 'game' && gameKeys[k]) return gameKeys[k]

  const visKeys: KeyMap = {
    Escape: Visualize('exit'),
    KeyV: Visualize('exit'),
    Digit1: Visualize('start'),
    Digit2: Visualize('middle'),
    Digit3: Visualize('end'),
    Space: Visualize('pause'),
  }
  if (context === 'visualizer' && visKeys[k]) return visKeys[k]

  console.log(`'${code}' ??`)
  logger('input').msg(`Key '${code}' not recognised`)
  return
}

export function listen(callback: (event: KeyboardEvent) => unknown) {
  document.addEventListener('keydown', event => {
    // ignore meta keys only
    switch (event.key) {
      case 'Shift':
      case 'Control':
      case 'Alt':
      case 'Meta':
        return
    }
    callback(event)
  })
}
