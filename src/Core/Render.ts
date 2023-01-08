import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from './Game'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { half, floor, clamp } from '../util/util'
import { displayDebugStrings } from '../util/display'

export const renderLevel = (d: ROT.Display, world: World, message: string, options: Game['options']) => {
  const { displayW, displayH, topPanelSize, botPanelSize } = CONFIG

  d.clear()
  d.drawText(0, 0, message)

  const { level } = world.current
  const yMax = d.getOptions().height - 1

  // * ========== Viewport ========== *
  const viewport = {
    w: displayW,
    h: displayH - topPanelSize - botPanelSize,
    x: {
      min: 0,
      max: displayW - 1,
    },
    y: {
      min: topPanelSize,
      max: displayH - botPanelSize - 1,
    },

    // allowed to move in this fraction of the center of the viewport
    // before changing the render point
    // TODO ?? figure this out
    // inner: {
    //   xMin: 12,
    //   xMax: 36,
    //   yMin: 6,
    //   yMax: 6,
    // },
  }

  // * center on player for now

  // if (level.width < viewport.w) {
  //   // if the level w/h is smaller than the viewport, just center it
  //   offsetX = half(CONFIG.displayW) - half(level.width)
  //   console.log('offsetX: small level, centered level')
  // } else {
  //   // offsetX = clamp(0, player.position.x, level.width)
  // }
  // } else if (offsetX > viewport.inner.xMin && offsetX < viewport.inner.xMax) {
  //   // within box, don't move
  //   // offsetX = clamp(viewport.w - level.width + 1, offsetX, 0, 'offsetX')
  //   console.log('offsetX: within inner box, shouldnt move')
  // } else {
  //   // outside box, move with player
  //   offsetX = centerX - player.position.x
  //   // offsetX = clamp(viewport.w - level.width + 1, offsetX, 0, 'offsetX')
  //   console.log('offsetX: outside box, move with player')
  // }

  // let offsetY = centerX - player.position.y

  // if (level.terrain.height < viewport.h) {
  //   // if the level w/h is smaller than the viewport, just center it
  //   offsetY = half(CONFIG.displayH) - half(level.terrain.height)
  //   console.log('offsetY: small level, centered level')
  // } else if (offsetY > viewport.inner.yMin && offsetY < viewport.inner.yMax) {
  //   // within box, don't move
  //   offsetY = clamp(viewport.h - level.height, offsetY, 0, 'offsetY')
  //   console.log('offsetY: within inner box, shouldnt move')
  // } else {
  //   // outside box, move with player
  //   offsetY = centerY - player.position.y
  //   offsetY = clamp(viewport.h - level.height, offsetY, 0, 'offsetY')
  //   console.log('offsetY: outside box, move with player')
  // }
  const player = world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]
  const centerX = floor(CONFIG.displayW / 2)
  const centerY = floor(CONFIG.displayH / 2)
  const offsetX = centerX - player.position.x
  const offsetY = centerY - player.position.y
  const left = viewport.x.min + offsetX
  const top = viewport.y.min + offsetY

  console.log('viewport width:', viewport.w, 'height:', viewport.h)
  console.log('level width:', level.width, 'height', level.height)
  console.log('player x', player.position.x, 'y', player.position.y)
  console.log('offsetX:', offsetX, 'offsetY', offsetY, 'top', top, 'left', left)

  // * ========== Rendering ========== *

  const doors = world.get('position', 'render', 'door')
  const entities = world.get('position', 'render').filter(e => doors.every(d => d.id !== e.id) && e !== player)

  level.terrain.each((here, t) => {
    // const render = { x: left + here.x, y: top + here.y }
    // if (
    //   render.x < viewport.x.min ||
    //   render.x > viewport.x.max ||
    //   render.y < viewport.y.min ||
    //   render.y > viewport.y.max
    // ) {
    //   return false
    // }

    const terrain = TerrainDictionary[t]
    const char: string[] = []
    const color: string[] = []

    const visible = player.fov.visible.includes(here.s)
    const seen = player.seen.visible.includes(here.s) || options.lightsOn

    // terrain
    const terrainVisible = terrain.render.base
    const terrainSeen = terrain.render.seen

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
        }
      })

    // player
    if (player.position.s === here.s) {
      char.push(player.render.base.char)
      color.push(player.render.base.color)
    }

    if (char.length > 0) {
      // if (here.y === 0) console.log('char:', char, color)
      d.draw(
        left + here.x,
        top + here.y,
        char,
        color,
        color.map((_c, i) => (i === 0 ? 'black' : 'transparent'))
      )
    } else d.draw(left + here.x, top + here.y, ' ', 'black', null) // blank

    // * level border
    if (options.showLevelBorder) {
      if (here.x === 0 || here.x === level.width - 1 || here.y === 0 || here.y === level.height - 1)
        d.draw(left + here.x, top + here.y, 'x', 'cyan', null)
      if (here.x === half(level.width) && here.y == half(level.height))
        d.draw(left + here.x, top + here.y, 'x', 'orange', null)
    }

    return true
  })

  // canvas debug
  if (options.lightsOn && options.showCanvasDebug) {
    const ddb = displayDebugStrings(d)
    d.drawText(0, yMax - 1, ddb[0])
    d.drawText(0, yMax, ddb[1])
  }

  // viewport debug
  if (options.debugMode) {
    d.drawText(5, 5, `offset: ${offsetX}/${offsetY}`)
    d.drawText(5, 6, `seed: ${ROT.RNG.getSeed()}`)
  }
}
