import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Engine } from '../Core/Engine'
import { point } from '../lib/Shape/Point'
import { half } from '../lib/util'

const { textDisplayWidth: dWidth, textDisplayHeight: dHeight } = CONFIG

export function renderMessageLog(engine: Engine) {
  const { local, textDisplay, messageLog, playerTurns, options } = engine

  const center = { x: half(dWidth), y: half(dHeight) }

  textDisplay.clear()

  // * single message
  const latestMsg = messageLog.at(-1)
  if (latestMsg && playerTurns - latestMsg.turn < 5) {
    const text = '~' + latestMsg.text + '~'
    const isLongMsg = ROT.Text.measure(text, dWidth).height > 1
    const x = isLongMsg ? 0 : center.x - half(latestMsg.text.length)

    textDisplay.drawText(x, dHeight - 2, text)
  }

  // ui messages
  const timeOnScreen = 2 * 1000
  const { uiMessageLog: uiLog } = engine
  const uiI = engine.uiMessageLog.length - 1
  if (uiLog[uiI] && Date.now() - uiLog[uiI].time < timeOnScreen) {
    textDisplay.drawText(center.x - half(uiLog[uiI].text.length), dHeight - 6, uiLog[uiI].text)
  }

  // debug
  if (options.debugMode) debugInfo(engine)

  // * this critical to the game rendering *
  local.hasChanged = false
}

function debugInfo(engine: Engine) {
  const { textDisplay, local } = engine

  const playerPos = local.player()?.position ?? point(0, 0)
  const [turnTime, renderTime] = getLogTimes(engine)

  textDisplay.drawText(0, 0, `${spinner.next()} ${fps()}`)
  textDisplay.drawText(0, 1, turnTime)
  textDisplay.drawText(0, 2, renderTime)
  textDisplay.drawText(0, 3, `E:${engine.local.entityList.length}`)
  textDisplay.drawText(0, 4, `P:${playerPos?.s ?? '??'}`)
  textDisplay.drawText(0, 6, `${local.name} ${engine.atlas.zone.regionIndex}`)
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
