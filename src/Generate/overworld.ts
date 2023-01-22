/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!! dev
import * as ROT from 'rot-js'
import { Grid } from '../Model/Grid'
import { Terrain, Features, Beings } from '../Templates'
import { createTemplates, Entity, hydrate } from '../Core/Entity'
import { Level } from '../Model/Level'
import { Point, Pt, StrPt } from '../Model/Point'
import { floor, half, mix, pick, repeat, rnd } from '../lib/util'
import { Overseer, Mutation } from './Overseer'
import { Room } from './structures/Room'
import { Rect } from './Rectangle'

// stairs/connectors?
export function overworld(width = 60, height = 29) {
  const t = Date.now()
  // ROT.RNG.setSeed(1234)
  console.log(ROT.RNG.getSeed())

  const grid = new Overseer(width, height, Terrain.void)

  // TODO common level points, make this resuable
  const center = Pt(half(width), half(height))

  repeat(10, () => walk(grid, Terrain.grass, 400)) // grass
  repeat(10, () => walk(grid, Terrain.deadGrass, 100)) // dead grass

  // outer/inner space markers
  const levelRect = Rect.at(Pt(0, 0), width, height)
  const outskirtsRect = levelRect.scale(-1)
  const innerRect = levelRect.scale(-6)

  // debug visual markers
  // const mutMarkers = grid.mutate()
  // outskirtsRect.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))
  // innerRect.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))

  // outskirt decoration
  outskirtsRect.traverse((pt, edge) => {
    if (edge) {
      // many mounds, some peaks in the north
      if (pt.y === outskirtsRect.y) {
        if (!rnd(8)) walkEastWest(grid, Terrain.peak, 20, pt)
        if (!rnd(4)) walkEastWest(grid, Terrain.mound, 20, pt)
      }

      // fewer mounds, more peaks in the south
      if (pt.y === outskirtsRect.y2) {
        if (!rnd(6)) walkEastWest(grid, Terrain.peak, 20, pt)
        if (!rnd(12)) walkEastWest(grid, Terrain.mound, 20, pt)
      }

      // scattered mounds/peaks, in the east and west
      if (pt.x === outskirtsRect.x) {
        if (!rnd(8)) walk(grid, Terrain.peak, 12, pt)
        if (!rnd(12)) walk(grid, Terrain.mound, 12, pt)
      }

      if (pt.x === outskirtsRect.x2) {
        if (!rnd(8)) walk(grid, Terrain.peak, 12, pt)
        if (!rnd(12)) walk(grid, Terrain.mound, 12, pt)
      }
    }
  })

  // scattered shrubs
  repeat(5, () => sparseWalk(grid, Terrain.shrub, 5, innerRect.rndEdgePt()))

  // western lake
  const westLakePt = Pt(outskirtsRect.x, center.y + rnd(-5, 5))
  repeat(4, () => walk(grid, Terrain.water, 30, westLakePt))

  // smaller southern lake
  const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  // ruined structures
  const inSpace = innerRect.width / 6
  const inX = innerRect.x
  const inX2 = innerRect.x2
  const structPts = mix([
    Pt(inX + inSpace, center.y + rnd(-2, 2)),
    Pt(inX + half(innerRect.width), center.y + rnd(-2, 2)),
    Pt(inX2 - inSpace, center.y + rnd(-2, 2)),
  ])

  // structure 1
  const bigRoom = new Room(rnd(9, 13), rnd(9, 13))
    .degradedFloor(Terrain.void, -1)
    .walls(10)
    .crumble(3)
    .door(Terrain.void)
  grid.mutate(bigRoom.place(structPts[0]))

  // structure 2
  const smallRoom = new Room(rnd(7, 9), rnd(7, 9)).degradedFloor(Terrain.void, -1).walls(10).crumble(2)
  grid.mutate(smallRoom.place(structPts[1]))

  // structure 3
  sparseWalk(grid, Terrain.shrub, rnd(3, 6), structPts[2])
  sparseWalk(grid, Terrain.tombstone, rnd(4, 8), structPts[2])
  const col = grid.mutate()
  col.set(structPts[2], Terrain.column)

  const level = new Level('overworld', grid.construct())
  level.overseer = grid

  const entities = createTemplates()

  console.log(`Done: ${Date.now() - t}ms`)
  console.log('grid', grid)
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

function walkEastWest(grid: Overseer, type: Entity, amount: number, start?: Point) {
  const mutations = grid.mutate()
  let pt = start ?? grid.internal.rndPt()
  mutations.set(pt, type)
  // north, east, south, west // favour e/w
  const moveNS = [Pt(0, -1), Pt(0, 1)]
  const moveEW = [Pt(-1, 0), Pt(1, 0)]
  repeat(amount, () => {
    const dir = rnd(3) ? pick(moveEW) : pick(moveNS)
    pt = pt.add(dir)
    mutations.set(pt, type)
  })
}

function sparseWalk(grid: Overseer, type: Entity, amount: number, start?: Point) {
  const mutations = grid.mutate()
  const pt = start ?? grid.internal.rndPt()
  repeat(amount, () => mutations.set(pt.add(Pt(rnd(-4, 4), rnd(-4, 4))), type))
}
