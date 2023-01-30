/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { repeat } from '../lib/util'
import { Message } from './Engine'

export function renderMessages(messages: Message[]) {
  const { msgDisplay } = window.game
  repeat(CONFIG.messageDisplayHeight, i => {
    // console.log('msg:', messages[i]?.text)
    if (messages[i]?.text) msgDisplay.drawText(20, i, messages[i]?.text)
  })
}
