/* generate - handles the level generator(s), returning only what we need
 might be unnecessary but I hated how much level data specific typing ended
 up in the main game functions
 */

import { Grid } from '../Model/Grid'
import { create } from './dungeon4/'
import { Pt } from '../Model/Point'
import { CONFIG } from '../config'
import { Level } from '../Model/Level'
import { EntityTemplates, createTemplates } from '../Core/Entity'
import { createDecor, populateNPCs } from './features'
import { Beings } from '../Templates'
import { Features } from '../Templates/Features'

export type NewLevel = [Level, EntityTemplates]

// TODO
// export type LevelGenerator = () => NewLevel

// const defaultGenConfig = {
//   width: CONFIG.mainDisplayWidth,
//   height: CONFIG.mainDisplayHeight,
//   stairsDesc: false,
// }
const lwidth = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayWidth : CONFIG.levelWidth
const lheight = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayHeight : CONFIG.levelHeight

export const dungeon4 = (stairsDown = true, stairsUp = true): NewLevel => {
  const data = create({
    width: lwidth,
    height: lheight,
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
    level.stairsDescendingPt = pt
    console.log('stairs down at', pt.x, pt.y)
  }

  if (stairsUp) {
    console.log('generate: stairs up')
    const pt = level.ptInRoom(0)
    level.terrainGrid.set(pt, 10)
    level.stairsAscendingPt = pt
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
    [Beings.bat, 0],
    [Beings.interest, 0],
    [Beings.blob, 0],
    [Beings.blob3, 0],
    [Beings.eye, 0],
    [Beings.zombie, 0],
    [Beings.giant, 0],
    [Beings.rat, 0],
    [Beings.orc2, 0],
  ]

  templates.features = [
    [Features.shrub, 0],
    [Features.shrub, 0],
    [Features.shrub, 0],
    [Features.shrub, 0],
    [Features.shrub, 0],
    [Features.shrub, 0],
  ]

  return [new Level('arena', terrain, new Map(), []), templates]
}
