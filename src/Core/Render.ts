import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from './Game'
import { World } from './World'
import { TurnMessages } from './State'
import { TerrainNumMap } from './Terrain'
import { half, floor, clamp, min } from '../lib/util'
import { Color } from 'rot-js/lib/color'

export const renderLevel = (d: ROT.Display, world: World, options: Game['options']) => {
  // console.log('Render', world.active)
  const { mainDisplayWidth: displayWidth, mainDisplayHeight: displayHeight, backgroundColor } = CONFIG

  d.clear()

  const level = world.active
  const yMax = d.getOptions().height - 1
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

  level.terrainGrid.each((here, t) => {
    const render = { x: offsetX + here.x, y: offsetY + here.y }

    // skip this location if we're outside of the viewport
    if (render.x < viewport.x1 || render.x > viewport.x2 || render.y < viewport.y1 || render.y > viewport.y2) {
      return false
    }

    // create array stacks of chars and colors of terrain + entities here
    const terrain = TerrainNumMap[t]
    const char: string[] = []
    const color: string[] = []

    const visible = player.fov.visible.includes(here.s) || options.lightsOn
    const seen = level.areaKnown.includes(here.s)
    const voidSeen = level.voidAreaKnown.includes(here.s) || options.lightsOn

    // terrain
    const terrainVisible = terrain.render.base
    const terrainSeen = terrain.render.seen

    // void decor
    const voidDecor = level.voidDecor.get(here.s)
    if (voidSeen && voidDecor) {
      char.push(terrainSeen?.char ?? terrainVisible.char)
      color.push(terrainSeen?.color ?? terrainVisible.color)
    }

    // if (!level.isInternalWall(here) || !options.hideInternalWalls) {
    if (visible) {
      char.push(terrainVisible.char)
      color.push(terrainVisible.color)
    } else if (seen) {
      char.push(terrainSeen?.char ?? terrainVisible.char)
      color.push(terrainSeen?.color ?? terrainVisible.color)
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
        color.push(door.render.seen?.color ?? door.render.base.color)
      }
    }

    // entities
    entities
      .filter(e => e.position.s === here.s)
      .forEach(e => {
        if (visible || options.lightsOn) {
          char.push(e.render.base.char)
          color.push(e.render.base.color)
        } else if (seen && e.render.seen?.color) {
          char.push(e.render.base.char)
          color.push(e.render.seen.color)
        }
      })

    // player
    if (player.position.s === here.s) {
      char.push(player.render.base.char)
      color.push(player.render.base.color)
    }

    // draw the stack, or a blank character if empty
    if (char.length > 0) {
      d.draw(
        render.x,
        render.y,
        char,
        color,
        color.map((_c, i) => (i === 0 ? backgroundColor : 'transparent'))
      )
    } else d.draw(offsetX + here.x, offsetY + here.y, ' ', backgroundColor, null) // blank

    // debug border / crosshairs
    if (options.debugMode) {
      // level border
      if (here.x === 0 || here.x === level.width - 1 || here.y === 0 || here.y === level.height - 1)
        d.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      if (here.x === half(level.width) && here.y == half(level.height))
        d.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      d.draw(half(viewport.w), half(displayHeight), 'o', 'orange', null)
    }

    return true
  })

  // debug display
  if (options.debugMode) {
    // top/bottom borders
    d.drawText(0, 0, '%c{orange}' + 'd'.repeat(CONFIG.mainDisplayWidth))
    d.drawText(0, yMax, '%c{orange}' + 'd'.repeat(CONFIG.mainDisplayWidth))

    d.drawText(2, viewport.y1 + 2, `Dean's Mode`)
    d.drawText(2, viewport.y1 + 3, `offset: ${offsetX}/${offsetY}`)
    d.drawText(2, viewport.y1 + 4, `seed: ${ROT.RNG.getSeed()}`)
    d.drawText(2, viewport.y1 + 5, `Player: ${player.position.x},${player.position.y}`)

    // for (let i = 0; i < botPanelSize; i++) {
    //   d.draw(xMax, yMax - i, 'b', 'green', null)
    // }
  }
}

export const renderMessages2 = (d: ROT.Display, world: World, options: Game['options']) => {
  const { messageDisplayWidth, messageDisplayHeight, backgroundColor } = CONFIG
  const { playerTurns, messages } = world.state
  console.log('playerTurns:', playerTurns)
  console.log('message', messages)
  const buffer: TurnMessages[] = []

  for (const msg of messages) {
    buffer.push(msg)

    if (
      ROT.Text.measure(buffer.map(m => m[1].join(' ')).join(' '), messageDisplayWidth).height >
      messageDisplayHeight + 1
    )
      break
  }

  let msgString = ''
  for (const msg of buffer) {
    const diff = playerTurns - msg[0]
    let color = '#FFF'

    if (diff > 0) {
      // fade messages as they get older, capped at (the R value of) the level bg color
      const bgColor = ROT.Color.fromString(backgroundColor)
      const subtract = diff * diff // ease in
      const newColor = ROT.Color.fromString(color).map(v => min(bgColor[0], v - subtract)) as Color
      console.log('newColor:', newColor)
      color = ROT.Color.toHex(newColor)
    }

    msgString += ` %c{${color}}` + msg[1].join('  ')
  }

  d.clear()
  d.drawText(0, 0, msgString)

  // debug message display marker
  if (options.debugMode) {
    for (let i = 0; i < CONFIG.messageDisplayHeight; i++) {
      d.draw(CONFIG.messageDisplayWidth - 1, i, 'm', 'green', null)
    }
  }
}
