/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!! dev
import * as ROT from 'rot-js'
import { Grid } from '../Model/Grid'
import { Terrain, Features, Beings } from '../Templates'
import { createTemplates, Entity, hydrate } from '../Core/Entity'
import { Level } from '../Model/Level'
import { Point, Pt, StrPt } from '../Model/Point'
import { floor, half, pick, repeat, rnd } from '../lib/util'
import { Overseer, Mutation } from './Overseer'

// stairs/connectors?
export function overworld(width = 60, height = 29) {
  const t = Date.now()
  ROT.RNG.setSeed(1234)
  console.log(ROT.RNG.getSeed())

  // const terrain = Grid.fill(width, height, Terrain.path)
  // const mutations: Mutation[] = []
  const grid = new Overseer(width, height, Terrain.path)

  // TODO common level points, make this resuable
  const center = Pt(half(width), half(height))

  // walk(grid, Terrain.grass, 1000, center)

  const tpt = grid.internal.rndPt()
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)
  walk(grid, Terrain.grass, 1000, tpt)

  // terrain.set(center, Terrain.water)

  // const west = Pt(half(center.x), center.y)
  // terrain.set(west, Terrain.water)

  // const centerwest = Pt(west.x + half(west.x), center.y)
  // terrain.set(centerwest, Terrain.water)

  // const westwest = Pt(half(west.x), center.y)
  // terrain.set(westwest, Terrain.water)
  // const quarterW = floor(center.x / 4)
  // terrain.set(Pt(quarterW, center.y), Terrain.water)
  // terrain.set(Pt(quarterW * 2, center.y), Terrain.water)
  // terrain.set(Pt(quarterW * 3, center.y), Terrain.water)

  // const east = Pt(width - half(center.x), center.y)
  // terrain.set(east, Terrain.water)

  const entities = createTemplates()
  const level = new Level('overworld', grid.construct())
  level.overseer = grid

  // repeat(width, i => level.terrainGrid.set(Pt(i, height - 4), hydrate(Beings.eye)))
  console.log(`Done: ${Date.now() - t}ms`)

  console.log('Main', grid.main)
  console.log('All', grid.mutations)

  return [level, entities]
}

function walk(grid: Overseer, type: Entity, amount: number, start?: Point) {
  const mutations = grid.mutate()
  let pt = start ?? grid.internal.rndPt()
  mutations.set(pt, type)
  // north, east, south, west
  const moves = [Pt(0, -1), Pt(1, 0), Pt(0, 1), Pt(-1, 0)]
  repeat(amount, () => {
    const dir = pick(moves)
    pt = pt.add(dir)
    mutations.set(pt, type)
  })
}
