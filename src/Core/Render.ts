import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from './Game'
import { EntityWith, World } from './World'
import { half, floor, clamp, min } from '../lib/util'
import { Entity } from './Entity'
import { Message, createWordRegex } from '../lib/messages'

// Seen terrain memory color modifiers
const darkenSat = 0.1
const darkenLum = 0.1
const darkenLumMin = 0.12

// luminance of background color (used as min value)
const bgLum = hexLuminance(CONFIG.backgroundColor)

export const renderLevel = (display: ROT.Display, world: World, options: Game['options']) => {
  // console.log('Render', world.active)
  const { mainDisplayWidth: displayWidth, mainDisplayHeight: displayHeight, backgroundColor } = CONFIG

  display.clear()

  const level = world.active
  const yMax = display.getOptions().height - 1
  // const xMax = d.getOptions().width - 1

  // * ========== Viewport ========== *
  const viewport = {
    w: displayWidth,
    h: displayHeight,
    x1: 0,
    x2: displayWidth - 1,
    y1: 0,
    y2: displayHeight - 1,
  }

  const [player] = world.get('tagPlayer', 'position', 'render', 'fov')
  const centerX = floor(displayWidth / 2)
  const centerY = floor(displayHeight / 2)

  const offsetX =
    level.width > viewport.w
      ? clamp(viewport.w - level.width, viewport.x1 + centerX - player.position.x, viewport.x1)
      : viewport.x1 + half(viewport.w - level.width)

  const offsetY =
    level.height >= viewport.h
      ? clamp(viewport.y1 + viewport.h - level.height, viewport.y1 + centerY - player.position.y, viewport.y1)
      : viewport.y1 + half(viewport.h - level.height)

  // * ========== Rendering ========== *

  const doors = world.get('position', 'render', 'door')
  const entities = world.get('position', 'render').filter(e => doors.every(d => d.id !== e.id) && e !== player)

  level.terrainGrid.each(here => {
    const render = { x: offsetX + here.x, y: offsetY + here.y }

    // skip this location if we're outside of the viewport
    if (render.x < viewport.x1 || render.x > viewport.x2 || render.y < viewport.y1 || render.y > viewport.y2) {
      return false
    }

    // create array stacks of chars and colors of terrain + entities here
    const terrain = level.terrain(here) as EntityWith<Entity, 'render'>
    const char: string[] = []
    const color: string[] = []

    const visible = player.fov.visible.includes(here.s)
    const seen = level.areaKnown.includes(here.s) || options.lightsOn
    const voidSeen = level.voidAreaKnown.includes(here.s) || options.lightsOn

    // terrain
    const terrainVisible = terrain.render.base
    const terrainSeenColor = darken(terrainVisible.color, darkenSat, darkenLum, darkenLumMin)

    // void decor
    const voidDecor = level.voidDecor.get(here.s)
    if (voidSeen && voidDecor) {
      char.push(terrainVisible.char)
      color.push(terrainSeenColor)
    }

    // if (!level.isInternalWall(here) || !options.hideInternalWalls) {
    if (visible) {
      char.push(terrainVisible.char)
      color.push(terrainVisible.color)
    } else if (seen) {
      char.push(terrainVisible.char)
      color.push(terrainSeenColor)
    }
    // }

    // door
    const door = doors.filter(d => d.position.s === here.s)[0]
    if (door) {
      const open = door.door.open
      const doorChar = open ? door.render?.baseDoorOpen?.char ?? door.render.base.char : door.render.base.char

      if (visible) {
        char.push(doorChar)
        color.push(door.render.base.color)
      } else if (seen) {
        char.push(doorChar)
        color.push(darken(door.render.base.color, darkenSat, darkenLum, darkenLumMin))
      }
    }

    // entities
    entities
      .filter(e => e.position.s === here.s)
      .forEach(e => {
        if (visible || options.lightsOn) {
          char.push(e.render.base.char)
          color.push(e.render.base.color)
        } else if (seen && e.tagMemorable) {
          char.push(e.render.base.char)
          color.push(darken(e.render.base.color, darkenSat, darkenLum, darkenLumMin))
        }
      })

    // player
    if (player.position.s === here.s) {
      char.push(player.render.base.char)
      color.push(player.render.base.color)
    }

    // draw the stack, or a blank character if empty
    if (char.length > 0) {
      display.draw(
        render.x,
        render.y,
        char,
        color,
        color.map((_c, i) => (i === 0 ? backgroundColor : 'transparent'))
      )
    } else display.draw(offsetX + here.x, offsetY + here.y, ' ', backgroundColor, null) // blank

    // debug border / crosshairs
    if (options.debugMode) {
      // level border
      if (here.x === 0 || here.x === level.width - 1 || here.y === 0 || here.y === level.height - 1)
        display.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      if (here.x === half(level.width) && here.y == half(level.height))
        display.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      display.draw(half(viewport.w), half(displayHeight), 'o', 'orange', null)
    }

    return true
  })

  // debug display
  if (options.debugMode) {
    // top/bottom borders
    display.drawText(0, 0, '%c{orange}' + 'd'.repeat(CONFIG.mainDisplayWidth))
    display.drawText(0, yMax, '%c{orange}' + 'd'.repeat(CONFIG.mainDisplayWidth))

    display.drawText(2, viewport.y1 + 2, `Dean's Mode`)
    display.drawText(2, viewport.y1 + 3, `offset: ${offsetX}/${offsetY}`)
    display.drawText(2, viewport.y1 + 4, `seed: ${ROT.RNG.getSeed()}`)
    display.drawText(2, viewport.y1 + 5, `Player: ${player.position.x},${player.position.y}`)
  }
}

const maxMessageAge = 16 // disappear after this many turns
const minColorizedLum = 0.5 // colorized entity name min luminance
export const renderMessages = (d: ROT.Display, world: World, options: Game['options']) => {
  const { messageDisplayWidth, messageDisplayHeight } = CONFIG
  const { playerTurns, messages } = world.state
  const buffer: Message[] = []

  // find messages to display which are not too old, or overflow the display area
  for (const msg of messages) {
    if (playerTurns - msg.turn > maxMessageAge) break
    buffer.push(msg)
    if (ROT.Text.measure(buffer.map(m => m.raw).join(' '), messageDisplayWidth).height > messageDisplayHeight + 1) break
  }

  // combine each message into a single string, while coloring entity names
  let combinedMsg = ''
  for (const msg of buffer) {
    // fade messages by decreasing luminance based on age
    const turnDiff = playerTurns - msg.turn
    const normalizedDiff = 1 - turnDiff / maxMessageAge
    const easedDiff = normalizedDiff * normalizedDiff // ease in

    const baseLum = hexLuminance(CONFIG.messageColor)

    // reduce luminance by 0% (new message) -> 100% (maxMessageAge)
    const baseColorFaded = transformHSL(CONFIG.messageColor, baseLum * easedDiff, bgLum)
    // boost the starting point of low luminance entity colors to a minimum (0.5) for readability
    const colorMapFaded = msg.colors.map(e => [
      e[0],
      transformHSL(e[1], min(minColorizedLum, hexLuminance(e[1])) * easedDiff, bgLum),
    ])

    // surround entity names with opening and closing ROT.JS color tags
    let colorizedMsg = msg.raw
    for (const item of colorMapFaded) {
      const [name, color] = item
      const target = createWordRegex(name)
      const colorized = `%c{${color}}${name}%c{${baseColorFaded}}`
      colorizedMsg = colorizedMsg.replaceAll(target, colorized)
    }

    combinedMsg += ` %c{${baseColorFaded}}` + colorizedMsg
  }

  d.clear()
  d.drawText(0, 0, combinedMsg)

  // debug message display marker
  if (options.debugMode) {
    for (let i = 0; i < CONFIG.messageDisplayHeight; i++) {
      d.draw(CONFIG.messageDisplayWidth - 1, i, 'm', 'green', null)
    }
  }
}

function darken(color: string, saturation: number, luminosity: number, minLum: number) {
  const c = ROT.Color.rgb2hsl(ROT.Color.fromString(color))

  c[1] = min(0, c[1] - saturation)
  c[2] = min(minLum, c[2] - luminosity)
  return ROT.Color.toHex(ROT.Color.hsl2rgb(c))
}

// return a hex color with set luminance
function transformHSL(color: string, lum: number, minLum: number) {
  const c = ROT.Color.rgb2hsl(ROT.Color.fromString(color))
  c[2] = min(minLum, lum)
  return ROT.Color.toHex(ROT.Color.hsl2rgb(c))
}

function hexLuminance(color: string) {
  const hsl = hexToHSL(color)
  return hsl[2]
}

function hexToHSL(color: string) {
  return ROT.Color.rgb2hsl(ROT.Color.fromString(color))
}
