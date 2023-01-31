import { CONFIG } from '../config'
import { Engine } from '../Core/Engine'
import { half, repeat } from '../lib/util'

export function renderMessageLog(engine: Engine) {
  const { msgDisplay, messageLog, playerTurns } = engine

  const displayOptions = msgDisplay.getOptions()
  const { width, height } = displayOptions
  const last = height - 1

  repeat(CONFIG.messageDisplayHeight, i => {
    const msg = messageLog[i]
    if (msg && playerTurns - msg.turn < 5) {
      const x = half(width) - half(msg.text.length)
      msgDisplay.drawText(x, i, messageLog[i]?.text)
    }
  })

  msgDisplay.drawText(0, last, spinner.next() + fps())
}

// FPS Spinner
const createSpinner = () => {
  const g = ['-', '\\', '|', '/']
  let i = 0

  const next = () => {
    i = i >= g.length - 1 ? 0 : i + 1
    return `%c{#333}${g[i]}%c{} `
  }

  return { next }
}
const spinner = createSpinner()

let lastFrameTime = 0
let lastMsgUpdate = 0
let fpsMsg = ''
function fps() {
  const now = Date.now()
  const diff = now - lastFrameTime
  if (lastFrameTime - lastMsgUpdate > 1000) {
    fpsMsg = `${(1000 / diff).toFixed(0)}`
    lastMsgUpdate = now
  }
  lastFrameTime = now
  return fpsMsg
}
