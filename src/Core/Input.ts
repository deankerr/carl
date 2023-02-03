// * Translate key code into Action

import { logger } from '../lib/logger'
import { ActionTypes, Move, MetaUI, ChangeRegion, ChangeDomain } from './Action'

type KeyMap = Record<string, ActionTypes>

export function handle(event: KeyboardEvent): ActionTypes | undefined {
  const { key, code, ctrlKey: ctrl, shiftKey: shift } = event
  // console.log('event:', event)
  // console.log(key, code, ctrl ? 'ctrl' : '', shift ? 'shift' : '')

  // * Numpad movement
  const move: KeyMap = {
    Numpad7: Move('NW'),
    Numpad8: Move('N'),
    Numpad9: Move('NE'),
    Numpad4: Move('W'),
    Numpad5: Move('WAIT'),
    Numpad6: Move('E'),
    Numpad1: Move('SW'),
    Numpad2: Move('S'),
    Numpad3: Move('SE'),
  }
  if (move[code]) return move[code]

  // * Arrow key movement
  switch (code) {
    case 'ArrowLeft':
      if (ctrl) return Move('SW')
      if (shift) return Move('NW')
      return Move('W')
    case 'ArrowRight':
      if (ctrl) return Move('SE')
      if (shift) return Move('NE')
      return Move('E')
    case 'ArrowDown':
      return Move('S')
    case 'ArrowUp':
      return Move('N')
  }

  // * Gameplay
  const game: KeyMap = {
    ',': ChangeRegion('up'),
    '.': ChangeRegion('down'),
  }
  if (game[key]) return game[key]

  // * Dev
  const dev: KeyMap = {
    KeyR: MetaUI('localRevealAll'),
    KeyT: MetaUI('localRecallAll'),
    Digit2: MetaUI('playerLight'),
    Digit3: MetaUI('formCycle'),
    Digit4: MetaUI('lightingUpdate'),
    // Debug log world
    KeyQ: MetaUI('debug_logworld'),
    KeyW: MetaUI('debug_loglocal'),
    KeyE: MetaUI('debug_logentities'),
    KeyA: MetaUI('debug_loglogger'),
  }
  if (shift && dev[code]) return dev[code]

  const domain: KeyMap = {
    1: ChangeDomain(0),
    2: ChangeDomain(1),
    3: ChangeDomain(2),
  }
  if (ctrl && domain[key]) return domain[key]

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
    setTimeout(() => callback(event), 0)
  })
}
