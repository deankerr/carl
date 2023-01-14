/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions

 later, something like: function generateLevel(Enum.Dungeon) {} ?
 */
// const max = 5
import { Grid } from '../Model/Grid'
import { create } from './dungeon4/'
import { Point, Pt } from '../Model/Point'
import { CONFIG } from '../config'
import { Room } from './dungeon4/dungeon4'
import { floor, half } from '../lib/util'
import { Level } from '../Model/Level'
import { beings, templates } from '../Core/Entity'
import { decor, populateNPCs } from './features'

const { levelWidth: levelWidthTileset, levelHeight: levelHeightTileset } = CONFIG

export type EntityTemplate = [keyof typeof templates, Point]
export type NewLevel = [Level, EntityTemplate[]]

export const dungeon4 = (stairsDown = true, stairsUp = false): NewLevel => {
  const data = create({
    width: floor(CONFIG.mainDisplayWidth * 1.2),
    height: floor(CONFIG.mainDisplayHeight * 1.1),
    minRoomW: 5,
    maxRoomW: 9,
    minRoomH: 5,
    maxRoomH: 9,
  })

  const terrainGrid = Grid.from(data[0])

  // no void decor from dungeon4
  const voidDecor = new Map()

  // map rooms to arrays of (new style) Points
  const rooms = data[1].map(r => r.rect.toPts().map(pt => Pt(pt.x, pt.y)))

  const label = 'dungeon4'
  const level = new Level(label, terrainGrid, voidDecor, rooms)

  // template name + position of doors
  const doors: EntityTemplate[] = data[2].map(pt => ['door', Pt(pt.x, pt.y)])
  const features = decor(level)
  const npcs = populateNPCs(level)

  const entityTemplates: EntityTemplate[] = [...doors, ...features, ...npcs]

  // stairs
  if (stairsDown) {
    const pt = level.ptInRoom(1)
    level.terrainGrid.set(pt, 11)
    level.stairsDescending = pt
    console.log('stairs down at', pt.x, pt.y)
  }

  if (stairsUp) {
    console.log('generate: stairs up')
    const pt = level.ptInRoom(0)
    level.terrainGrid.set(pt, 10)
    level.stairsAscending = pt
    console.log('stairs up at', pt.x, pt.y)
  }

  return [level, entityTemplates]
}

export type EntityTemplate2 = [keyof typeof beings, Point]
export type NewLevel2 = [Level, EntityTemplate2[]]

export const arena = (): NewLevel2 => {
  const terrain = Grid.fill(9, 9, 0)
  terrain.each(pt => {
    if (pt.x === 0 || pt.x === terrain.width - 1 || pt.y === 0 || pt.y === terrain.height - 1) {
      terrain.set(pt, 1)
    }
  })

  const templates: EntityTemplate2[] = [
    ['bat', Pt(half(terrain.width), half(terrain.height))],
    ['interest', Pt(half(terrain.width), half(terrain.height))],
    ['blob', Pt(half(terrain.width), half(terrain.height))],
    ['eye', Pt(half(terrain.width), half(terrain.height))],
    ['zombie', Pt(half(terrain.width), half(terrain.height))],
    ['gary', Pt(half(terrain.width), half(terrain.height))],
    ['rat', Pt(half(terrain.width), half(terrain.height))],
  ]

  return [new Level('arena', terrain, new Map(), []), templates]
}

export const bigRoom = () => {
  const terrain = Grid.fill(levelWidthTileset, levelHeightTileset, 0)
  return {
    terrain,
    rooms: [Room.scaled(half(levelWidthTileset), half(levelHeightTileset), 1, 1)],
    entities: [],
    label: 'big room',
  }
}
