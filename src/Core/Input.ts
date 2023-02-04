// * Translate key code into Action

import { logger } from '../lib/logger'
import { ActionTypes, Move, MetaUI, ChangeRegion, ChangeDomain, Visualize } from './Action'

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

  const vis: KeyMap = {
    v: Visualize('init'),
  }
  if (vis[key]) return vis[key]

  // * Dev SHIFT +
  const dev: KeyMap = {
    Digit1: ChangeDomain(0),
    Digit2: ChangeDomain(1),
    Digit3: ChangeDomain(2),
    KeyR: MetaUI('revealAll'),
    KeyL: MetaUI('animation'),
    KeyQ: MetaUI('logWorld'),
  }
  if (shift && dev[code]) return dev[code]

  const dev2: KeyMap = {
    Minus: MetaUI('decreaseMainDisplay'),
    Equal: MetaUI('increaseMainDisplay'),
    Backquote: MetaUI('debugMode'),
  }
  if (dev2[code]) return dev2[code]

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
