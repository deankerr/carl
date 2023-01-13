import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from './Game'
import { World } from './World'
import { TerrainNumMap } from './Terrain'
import { half, floor, clamp } from '../util/util'
import { displayDebugStrings } from '../util/display'

const bg = '#131313' // TODO integrate into config/palette

export const renderLevel = (d: ROT.Display, world: World, message: string, options: Game['options']) => {
  // console.log('Render', world.active)
  const { displayW, displayH, topPanelSize, botPanelSize } = CONFIG

  d.clear()
  d.drawText(0, 0, message)

  const level = world.active
  const yMax = d.getOptions().height - 1
  const xMax = d.getOptions().width - 1

  // * ========== Viewport ========== *
  const viewport = {
    w: displayW,
    h: displayH - topPanelSize - botPanelSize,
    x1: 0,
    x2: displayW - 1,
    y1: topPanelSize,
    y2: displayH - botPanelSize - 1,
  }

  const [player] = world.get('tagPlayer', 'position', 'render', 'fov')
  const centerX = floor(CONFIG.displayW / 2)
  const centerY = floor(CONFIG.displayH / 2)

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
        color.map((_c, i) => (i === 0 ? bg : 'transparent'))
      )
    } else d.draw(offsetX + here.x, offsetY + here.y, ' ', bg, null) // blank

    // debug level border / crosshairs
    if (options.debugMode) {
      if (here.x === 0 || here.x === level.width - 1 || here.y === 0 || here.y === level.height - 1)
        d.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      if (here.x === half(level.width) && here.y == half(level.height))
        d.draw(offsetX + here.x, offsetY + here.y, 'x', 'cyan', null)
      d.draw(half(viewport.w), half(displayH), 'o', 'orange', null)
    }

    return true
  })

  // canvas debug
  if (options.lightsOn && options.showCanvasDebug) {
    const ddb = displayDebugStrings(d)
    d.drawText(0, yMax - 1, ddb[0])
    d.drawText(0, yMax, ddb[1])
  }

  // debug display
  if (options.debugMode) {
    d.drawText(2, viewport.y1 + 2, `Dean's Mode`)
    d.drawText(2, viewport.y1 + 3, `offset: ${offsetX}/${offsetY}`)
    d.drawText(2, viewport.y1 + 4, `seed: ${ROT.RNG.getSeed()}`)
    d.drawText(2, viewport.y1 + 5, `Player: ${player.position.x},${player.position.y}`)

    for (let i = 0; i < topPanelSize; i++) {
      d.draw(xMax, i, 't', 'green', null)
    }

    for (let i = 0; i < botPanelSize; i++) {
      d.draw(xMax, yMax - i, 'b', 'green', null)
    }
  }
}
