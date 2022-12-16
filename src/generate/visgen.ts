import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from '../game'
import { Dungeon1 } from './Dungeon1'

export function visgen(display: ROT.Display) {
  console.log('visgen init')

  const { levelW, levelH } = CONFIG
  const playbackSpeed = 250
  const animate = true

  let dungeon: Dungeon1
  let result: string[][][] = []
  let index: number
  let fail = false
  let animating = false
  let game = false
  // let blockNewGen = false

  generate()

  // Key handling
  document.addEventListener('keydown', (event) => {
    // Show keycode
    // console.log(`key: ${event.code}`)
    if (game) return
    switch (event.code) {
      case 'Space':
        if (animating) return
        event.preventDefault()
        // if (blockNewGen) break
        generate()
        if (animate) animateResult()
        else renderFinal()
        break

      case 'ArrowLeft':
        if (animating) return
        if (index > 0) {
          index--
          renderMap(result[index], index)
        }
        break

      case 'ArrowRight':
        if (animating) return
        if (index < result.length - 1) {
          index++
          renderMap(result[index], index)
        }
        break

      case 'KeyP':
        if (animating) return
        game = true
        Game(display, dungeon)
        break

      case 'Escape':
        animating = false
        setTimeout(() => renderFinal(), playbackSpeed)
        break
    }
  })

  // click pos
  const ctx = display.getContainer()
  if (ctx) {
    ctx.addEventListener('mousedown', (event) => {
      if (game) return
      console.log(display.eventToPosition(event))
    })
  }

  /// === Functions ===
  function generate() {
    fail = false
    result = []
    try {
      dungeon = new Dungeon1(levelW, levelH, result)
      dungeon.create()
    } catch (error) {
      // blockNewGen = true
      fail = true
      console.error(error)
    }

    index = result.length - 1
    if (animate) animateResult()
    else renderFinal()
    // console.log(dungeon)
    // console.log(result)
  }

  function animateResult() {
    animating = true
    index = 0
    renderMap(result[0], index)
  }

  function renderMap(m: string[][], i: number) {
    display.clear()
    const msg = m[m.length - 1]
    m.forEach((row, y, arr) => {
      // skip msg line
      if (y === arr.length - 1) return

      row.forEach((char, x) => {
        let color = '#666'
        if (char[1]) {
          if (char[1] === 'r') color = 'red'
          if (char[1] === 'g') color = 'lightgreen'
          if (char[1] === 'c') color = 'cyan'
          if (char[1] === 'u') color = '#222'
          if (char[1] === 'b') color = 'saddlebrown'
        }
        display.draw(x, y + 2, char[0], color, null)
      })
    })
    display.drawText(0, CONFIG.displayHeight - 2, `${i}: ${msg}`)

    // last frame, show controls
    if (i === result.length - 1) {
      display.drawText(0, CONFIG.displayHeight - 1, `[SPACE]: Genereate new, [LEFT/RIGHT]: Step, [P]: Play`)
      animating = false
    } else {
      display.drawText(0, CONFIG.displayHeight - 1, `[ESC] Skip slideshow`)
    }

    if (fail && i === result.length - 1) {
      const failText = '*** I failed :( ***'
      display.drawText(
        Math.floor(display.getOptions().width / 2 - failText.length / 2),
        Math.floor(display.getOptions().height >> 1) - 1,
        '%c{red}' + failText
      )
    }

    if (animating) {
      index++
      setTimeout(() => {
        renderMap(result[index], index)
      }, playbackSpeed)
    }
  }

  function renderFinal() {
    const final = result.length - 1
    renderMap(result[final], final)
  }
}
