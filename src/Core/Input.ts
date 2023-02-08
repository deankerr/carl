// * Translate key code into Action

import { logger } from '../lib/logger'
import { ActionTypes, Move, MetaUI, ChangeRegion, ChangeDomain, Visualize } from './Action'

type KeyMap = Record<string, ActionTypes>

export function handle(event: KeyboardEvent): ActionTypes | undefined {
  const { code, ctrlKey: ctrl, metaKey: meta, shiftKey: shift } = event
  // console.log('event:', event)
  const k = `${ctrl || meta ? 'ctrl ' : ''}${shift ? 'shift ' : ''}${code}`

  // * Numpad movement
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

  const keyMap: KeyMap = {
    Comma: ChangeRegion('up'),
    Period: ChangeRegion('down'),
    'shift KeyV': Visualize('init'),
    // debug
    'shift Digit1': ChangeDomain(0),
    'shift Digit2': ChangeDomain(1),
    'shift Digit3': ChangeDomain(2),
    'shift KeyR': MetaUI('revealAll'),
    'shift KeyL': MetaUI('animation'),
    'shift KeyQ': MetaUI('logWorld'),
    Digit9: MetaUI('displayRegion'),
    Digit0: MetaUI('displayDefault'),
    Minus: MetaUI('displayZoomOut'),
    Equal: MetaUI('displayZoomIn'),
    Backquote: MetaUI('debugMode'),
  }
  if (keyMap[k]) return keyMap[k]

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
