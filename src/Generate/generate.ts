/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions

 later, something like: function generateLevel(Enum.Dungeon) {} ?
 */

import { Grid } from '../Model/Grid'
import { create } from './dungeon4/'
import { Pt } from '../Model/Point'
import { CONFIG } from '../config'
import { floor } from '../lib/util'
import { Level } from '../Model/Level'
import { EntityTemplates, beings, features, createTemplates } from '../Core/Entity'
import { createDecor, populateNPCs } from './features'

// const { levelWidth: levelWidthTileset, levelHeight: levelHeightTileset } = CONFIG

// export type EntityTemplate = [keyof typeof templates, Point]
// export type NewLevel = [Level, EntityTemplate[]]

export type NewLevel = [Level, EntityTemplates]

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
  const doors = data[2].map(pt => Pt(pt.x, pt.y)) //as ['door', Point][]
  const features = createDecor(level)
  const beings = populateNPCs(level)

  const entityTemplates: EntityTemplates = { beings, features, doors }

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

export const arena = (): NewLevel => {
  const terrain = Grid.fill(9, 9, 0)
  terrain.each(pt => {
    if (pt.x === 0 || pt.x === terrain.width - 1 || pt.y === 0 || pt.y === terrain.height - 1) {
      terrain.set(pt, 1)
    }
  })

  const templates = createTemplates()
  templates.beings = [
    [beings.bat, 0],
    [beings.interest, 0],
    [beings.blob, 0],
    [beings.blobKing, 0],
    [beings.eye, 0],
    [beings.zombie, 0],
    [beings.giant, 0],
    [beings.rat, 0],
    [beings.orc2, 0],
  ]

  templates.features = [
    [features.shrub, 0],
    [features.shrub, 0],
    [features.shrub, 0],
    [features.shrub, 0],
    [features.shrub, 0],
    [features.shrub, 0],
  ]

  return [new Level('arena', terrain, new Map(), []), templates]
}

// export const bigRoom = () => {
//   const terrain = Grid.fill(levelWidthTileset, levelHeightTileset, 0)
//   return {
//     terrain,
//     rooms: [Room.scaled(half(levelWidthTileset), half(levelHeightTileset), 1, 1)],
//     entities: [],
//     label: 'big room',
//   }
// }
