// import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Engine } from '../Core/Engine'
import { half, loop } from '../lib/util'

export function renderMessageLog(engine: Engine) {
  const { messageDisplayHeight, messageBufferDisplaySize, messageColor } = CONFIG
  const { local, msgDisplay, messageLog, playerTurns, options } = engine
  if (!local.hasChanged) return

  const displayOptions = msgDisplay.getOptions()
  const { width, height } = displayOptions
  const last = height - 1

  msgDisplay.clear()

  const fg = messageColor

  const bg = local.voidColorUnrevealed || 'black'
  // const bg = 'transparent'

  // message buffer
  loop(messageDisplayHeight, i => {
    const msg = messageLog[i]
    if (msg && playerTurns - msg.turn < 8) {
      const x = half(width) - half(msg.text.length)
      msgDisplay.drawText(
        x,
        last - messageBufferDisplaySize + i,
        ` %b{${bg}}%c{${fg}}${messageLog[i]?.text} `
      )
    }
  })
  local.hasChanged = false

  // render spinner
  msgDisplay.drawText(0, 0, `${spinner.next()}`)

  if (options.debugMode) debugInfo(engine)
}

function debugInfo(engine: Engine) {
  const { msgDisplay, local } = engine

  const playerPos = local.player().position.s ?? '?'
  msgDisplay.drawText(0, 0, `${spinner.next()} ${fps()} ${getLogTimes()} P:${playerPos}`)
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

function getLogTimes() {
  const turn = window.logger.logGroups.get('sys.runTurns')?.avg.toFixed(0) ?? ''
  const render = window.logger.logGroups.get('sys.runRender')?.avg.toFixed(0) ?? ''
  return `T:${turn}ms R:${render}ms`
}
