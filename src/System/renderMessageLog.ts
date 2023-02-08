import { CONFIG } from '../config'
import { Engine, Message } from '../Core/Engine'
// import { transformHSL } from '../lib/color'
import { half, loop, range } from '../lib/util'

export function renderMessageLog(engine: Engine) {
  if (!engine.local.hasChanged) return

  const { messageDisplayHeight, messageBufferDisplaySize } = CONFIG
  const { local, mainDisplay, msgDisplay, messageLog, playerTurns, options } = engine

  const displayOptions = msgDisplay.getOptions()
  const { width, height } = displayOptions

  // const lastY = height - 1
  const center = { x: half(width), y: half(height) }

  msgDisplay.clear()

  // region name
  const name = local.name
  msgDisplay.drawText(center.x - half(name.length), 0, name)

  // game message buffer
  // const msgStack = messageLog.slice(-messageBufferDisplaySize).reverse()
  // const msgBufferY = height - messageBufferDisplaySize

  // loop(messageDisplayHeight, i => {
  //   const msg = msgStack[i]
  //   if (msg && playerTurns - msg.turn < 10) {
  //     const x = center.x - half(msg.text.length)
  //     const y = msgBufferY + i

  //     textToTile(msg, (xi, char, color) => {
  //       mainDisplay.draw(x + xi, y, char, color, local.palette.unknown)
  //     })

  //     // padding
  //     mainDisplay.draw(x - 1, y, 'solid', local.palette.unknown, null) // left
  //     mainDisplay.draw(x + msg.text.length, y, 'solid', local.palette.unknown, null) // right
  //   }
  // })

  // * this important flag should probably be handled better
  local.hasChanged = false

  // ui messages
  const timeOnScreen = 2 * 1000
  const { uiMessageLog: uiLog } = engine
  const uiI = engine.uiMessageLog.length - 1
  if (uiLog[uiI] && Date.now() - uiLog[uiI].time < timeOnScreen) {
    msgDisplay.drawText(center.x - half(uiLog[uiI].text.length), height - 6, uiLog[uiI].text)
  }

  // render spinner
  msgDisplay.drawText(0, 0, `${spinner.next()}`)

  if (options.debugMode) debugInfo(engine)
}

function debugInfo(engine: Engine) {
  const { msgDisplay, local } = engine

  const playerPos = local.player().position ?? '?'
  const t = local.terrainAt(playerPos)

  msgDisplay.drawText(2, 0, `${fps()} ${getLogTimes()}`)
  msgDisplay.drawText(0, 1, `E:${engine.local.entities.length}`)
  msgDisplay.drawText(0, 2, `Gen: ${local.visualizer?.history[0].message}ms`)
  msgDisplay.drawText(0, 3, `P:${playerPos.s}`)
  msgDisplay.drawText(0, 4, `${t.label} ${t.form.color} ${t.form.bgColor}`)
}

// ROT.JS text color code format
// function fg(color?: string) {
//   return `%c{${color ?? ''}}`
// }
// fg('')

// function bg(color: string) {
//   return `%b{${color}}`
// }

function textToTile(msg: Message, callback: (xi: number, char: string, color: string) => unknown) {
  if (msg.text.length === 0) return
  const start = msg.text.indexOf(msg.highlight)
  const end = start + msg.highlight.length

  for (const i of range(0, msg.text.length - 1)) {
    if (start >= 0 && i >= start && i <= end) callback(i, msg.text[i], msg.color)
    else callback(i, msg.text[i], CONFIG.messageColor)
  }
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
