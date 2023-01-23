import { Level } from '../../src/Model/Level'
import { rnd, repeat, pick } from '../../src/lib/util'
import { FeatureTemplate, Features } from '../../src/Templates/Features'
import * as Template from '../../src/Templates'
import { Point } from '../../src/Model/Point'

export const populateNPCs = (level: Level) => {
  const newBeings: [Template.BeingTemplate, Point | 0][] = []
  const npcs = Object.entries(Template.Beings).filter(b => b[1].id !== 'player')
  repeat(12, () => {
    newBeings.push([pick(npcs)[1], level.ptInRoom()])
  })

  // Object.entries(beings).map(b => [b[1], level.ptInRoom()])

  return newBeings
}

export const populateALLNPCs = (level: Level): [Template.BeingTemplate, Point | 0][] => {
  return Object.entries(Template.Beings)
    .filter(b => b[1].id !== 'player')
    .map(b => [b[1], level.ptInRoom()])
}

export const createDecor = (level: Level) => {
  const newFeatures: [FeatureTemplate, Point | 0][] = []

  level.rooms.forEach((_r, i) => {
    // shrubbery
    if (i % 3 === 0) {
      for (let j = 0; j < 6; j++) newFeatures.push([Features.shrub, level.ptInRoom(i)])
    }

    // water
    // if (i % 4 === 1) {
    //   r.forEach(pt => level.terrainGrid.set(pt, 3))
    // }

    // fire
    // if (i % 4 === 1) {
    const opts = [
      Features.flames,
      Features.blueFlames,
      Features.greenFlames,
      Features.cyanFlames,
      Features.magentaFlames,
      Features.purpleFlames,
      Features.redFlames,
      Features.yellowFlames,
    ]

    newFeatures.push([pick(opts), level.ptInRoom(i)])
    // }
  })

  // cracked walls/paths
  level.terrainGrid.each((pt, t) => {
    if (typeof t === 'number') {
      if (t === 0 && rnd(0, 3) === 0) level.terrainGrid.set(pt, rnd(4, 7))
      if (t === 1 && rnd(0, 16) === 0) level.terrainGrid.set(pt, 2)
    }
  })

  return newFeatures
}