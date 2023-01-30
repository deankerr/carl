/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { repeat } from '../lib/util'
import { Message } from './Engine'
import { Region } from './Region'

export function renderRegion(local: Region) {
  const { display, point } = window.game

  local.render((pt, entities) => {
    const chars = entities.map(e => e.form.char)
    const colors = entities.map(e => e.form.color)
    const bgColors = entities.map(e => e.form.bgColor)

    if (chars.length > 0) display.draw(pt.x, pt.y, chars, colors, bgColors)
  })
}

export function renderMessages(messages: Message[]) {
  const { msgDisplay } = window.game
  repeat(CONFIG.messageDisplayHeight, i => {
    console.log('msg:', messages[i]?.text)
    if (messages[i]?.text) msgDisplay.drawText(0, i, messages[i]?.text)
  })
}
