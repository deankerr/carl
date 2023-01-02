import * as ROT from 'rot-js'
import { CONFIG } from '../config'

export function createDisplay(width = CONFIG.displayWidth, height = CONFIG.displayHeight) {
  const display = new ROT.Display({
    width,
    height,
    fontFamily: 'Inconsolata',
  })

  resize(display)

  window.addEventListener('resize', () => {
    resize(display)
  })

  const container = display.getContainer()
  if (!container) throw new Error('Unable to get ROT.Display container.')

  document.body.appendChild(container)

  return display
}

// Resize display to fill available space
function resize(display: ROT.Display) {
  const screenW = document.documentElement.clientWidth
  const screenH = document.documentElement.clientHeight
  const compSize = display.computeFontSize(screenW, screenH)
  display.setOptions({ fontSize: compSize - 1 })
}

export function mouseMove(d: ROT.Display, callback: (event: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousemove', callback)
  }
}

export function mouseClick(d: ROT.Display, callback: (event: MouseEvent) => unknown) {
  const ctx = d.getContainer()
  if (ctx) {
    ctx.addEventListener('mousedown', callback)
  }
}
