import * as ROT from 'rot-js'
import { templates } from '../Core/Entity'
import { Level } from '../Model/Level'
import { rnd } from '../lib/util'
import { EntityTemplate } from './generate'

export const populateNPCs = (level: Level) => {
  const entityTemplates: EntityTemplate[] = []

  const npcs = ROT.RNG.shuffle([
    'orc',
    'spider',
    'snake',
    'toad',
    'crab',
    'ghost',
    'demon',
    'hammerhead',
    'skeleton',
    'chicken',
    'bat',
    'karl',
  ]) as Array<keyof typeof templates>

  level.rooms.forEach((_r, i) => {
    if (i === 0 || i >= npcs.length) return
    const pos = level.ptInRoom(i)
    const choice = npcs[i]
    if (templates[choice]) entityTemplates.push([choice, pos])
  })

  return entityTemplates
}

export const decor = (level: Level) => {
  const entityTemplates: EntityTemplate[] = []

  level.rooms.forEach((r, i) => {
    // shrubbery
    if (i % 3 === 0) {
      for (let j = 0; j < 6; j++) entityTemplates.push(['shrub', level.ptInRoom(i)])
    }

    // water
    if (i % 4 === 1) {
      r.forEach(pt => level.terrainGrid.set(pt, 3))
    }
  })

  // cracked walls/paths
  level.terrainGrid.each((pt, t) => {
    if (t === 0 && rnd(0, 3) === 0) level.terrainGrid.set(pt, rnd(4, 7))
    if (t === 1 && rnd(0, 16) === 0) level.terrainGrid.set(pt, 2)
  })

  return entityTemplates
}
