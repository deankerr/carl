import { Level } from '../Model/Level'
import { rnd } from '../lib/util'
import { BeingTemplate, beings, features, FeatureTemplate } from '../Core/Entity'
import { Point } from '../Model/Point'

export const populateNPCs = (level: Level) => {
  const newBeings: [BeingTemplate, Point | 0][] = Object.entries(beings).map(b => [b[1], level.ptInRoom()])

  return newBeings
}

export const createDecor = (level: Level) => {
  const newFeatures: [FeatureTemplate, Point | 0][] = []

  level.rooms.forEach((r, i) => {
    // shrubbery
    if (i % 3 === 0) {
      for (let j = 0; j < 6; j++) newFeatures.push([features.shrub, level.ptInRoom(i)])
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

  return newFeatures
}
