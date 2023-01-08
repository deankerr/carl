import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { Game } from './Game'
import { World } from './World'
import { TerrainDictionary } from './Terrain'
import { half } from '../util/util'
import { displayDebugStrings } from '../util/display'

export const renderLevel = (display: ROT.Display, world: World, message: string, options: Game['options']) => {
  const d = display
  const { level } = world.current

  const top = CONFIG.renderLevelY1
  const left = half(CONFIG.displayWidthTileset) - half(level.terrain.width)
  const yMax = d.getOptions().height - 1

  d.clear()

  // messages
  d.drawText(0, 0, message)

  const player = world.get('tagPlayer', 'position', 'render', 'fov', 'seen')[0]
  const doors = world.get('position', 'render', 'door')
  const entities = world.get('position', 'render').filter(e => doors.every(d => d.id !== e.id) && e !== player)

  level.terrain.each((here, t) => {
    const terrain = TerrainDictionary[t]
    const char: string[] = []
    const color: string[] = []

    const visible = player.fov.visible.includes(here.s)
    const seen = player.seen.visible.includes(here.s) || options.lightsOn

    // terrain
    const terrainVisible = terrain.render.base
    const terrainSeen = terrain.render.seen

    if (!level.isInternalWall(here) || !options.hideInternalWalls) {
      if (visible) {
        char.push(terrainVisible.char)
        color.push(terrainVisible.color)
      } else if (seen) {
        char.push(terrainSeen?.char ?? terrainVisible.char)
        color.push(terrainSeen?.color ?? terrainVisible.color)
      }
    }

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

    char.length > 0
      ? d.draw(
          left + here.x,
          top + here.y,
          char,
          color,
          color.map((_c, i) => (i === 0 ? 'black' : 'transparent'))
        )
      : d.draw(left + here.x, top + here.y, ' ', 'black', null) // blank
  })

  // display debug
  if (options.lightsOn && options.showDisplayDebug) {
    const ddb = displayDebugStrings(d)
    d.drawText(0, yMax - 1, ddb[0])
    d.drawText(0, yMax, ddb[1])
  }
}
