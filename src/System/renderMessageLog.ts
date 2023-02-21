import { CONFIG } from '../config'
import { Engine } from '../Core/Engine'
import { half, loop } from '../lib/util'

const { messageDisplayHeight, messageBufferDisplaySize } = CONFIG

export function renderMessageLog(engine: Engine) {
  const { local, msgDisplay, textDisplay, messageLog, playerTurns, options } = engine

  const displayOptions = msgDisplay.getOptions()
  const { width, height } = displayOptions

  // const lastY = height - 1
  const center = { x: half(width), y: half(height) }

  msgDisplay.clear()

  // region name
  const name = local.name + ' ' + engine.atlas.zone.regionIndex
  msgDisplay.drawText(center.x - half(name.length), 0, name)

  // game message buffer
  const msgStack = messageLog.slice(-messageBufferDisplaySize).reverse()
  const msgBufferY = height - messageBufferDisplaySize

  loop(messageDisplayHeight, i => {
    const msg = msgStack[i]
    if (msg && playerTurns - msg.turn < 10) {
      const x = center.x - half(msg.text.length)
      const y = msgBufferY + i

      msgDisplay.drawText(x, y, msg.text)
    }
  })

  // ui messages
  const timeOnScreen = 2 * 1000
  const { uiMessageLog: uiLog } = engine
  const uiI = engine.uiMessageLog.length - 1
  if (uiLog[uiI] && Date.now() - uiLog[uiI].time < timeOnScreen) {
    msgDisplay.drawText(center.x - half(uiLog[uiI].text.length), height - 6, uiLog[uiI].text)
  }

  // render spinner
  const { height: textHeight } = textDisplay.getOptions()
  textDisplay.drawText(0, textHeight - 1, `${spinner.next()}`)
  if (options.debugMode) debugInfo(engine)

  // * this critical to the game rendering *
  local.hasChanged = false
}

function debugInfo(engine: Engine) {
  const { msgDisplay, local } = engine

  const playerPos = local.player()?.position
  const [turnTime, renderTime] = getLogTimes(engine)

  msgDisplay.drawText(0, 0, `${fps()}`)
  msgDisplay.drawText(0, 1, turnTime)
  msgDisplay.drawText(0, 2, renderTime)
  msgDisplay.drawText(0, 3, `E:${engine.local.entityList.length}`)
  msgDisplay.drawText(0, 4, `P:${playerPos?.s ?? '??'}`)
}

function getLogTimes(engine: Engine) {
  const { system } = engine
  if (system.turnTimeHistory.length > 200) system.turnTimeHistory.splice(0, 100)
  const turnAvg = system.turnTimeHistory.slice(-10).reduce((avg, t) => avg + t, 0) / 10
  const turnLast = system.turnTimeHistory[system.turnTimeHistory.length - 1]

  if (system.renderTimeHistory.length > 1200) system.renderTimeHistory.splice(0, 600)
  const render =
    system.renderTimeHistory.reduce((avg, t) => avg + t, 0) / system.renderTimeHistory.length
  return [`T:${Math.floor(turnAvg)}ms / ${Math.floor(turnLast)}`, `R:${Math.floor(render)}ms`]
}

let lastFrameTime = 0
let lastMsgUpdate = 0
let fpsMsg = ''

function fps() {
  const now = Date.now()
  const diff = now - lastFrameTime
  if (lastFrameTime - lastMsgUpdate > 500) {
    fpsMsg = `${(1000 / diff).toFixed(0)}`
    lastMsgUpdate = now
  }
  lastFrameTime = now
  return fpsMsg
}

// FPS Spinner
const createSpinner = () => {
  const g = ['-', '\\', '|', '/']
  let i = 0

  const next = () => {
    i = i >= g.length - 1 ? 0 : i + 1
    return `${g[i]}`
  }

  return { next }
}
const spinner = createSpinner()

// ROT.JS text color code format
// function fg(color?: string) {
//   return `%c{${color ?? ''}}`
// }
// fg('')

// function bg(color: string) {
//   return `%b{${color}}`
// }

// function textToTile(msg: Message, callback: (xi: number, char: string, color: string) => unknown) {
//   if (msg.text.length === 0) return
//   const start = msg.text.indexOf(msg.highlight)
//   const end = start + msg.highlight.length

//   for (const i of range(0, msg.text.length - 1)) {
//     if (start >= 0 && i >= start && i <= end) callback(i, msg.text[i], msg.color)
//     else callback(i, msg.text[i], CONFIG.messageColor)
//   }
// }
