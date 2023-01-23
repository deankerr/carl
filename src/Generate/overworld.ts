/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!! dev
import * as ROT from 'rot-js'
import { Grid } from '../Model/Grid'
import { Terrain, Features, Beings } from '../Templates'
import { createTemplates, Entity, EntityTemplate, hydrate } from '../Core/Entity'
import { Level } from '../Model/Level'
import { Point, Pt, StrPt } from '../Model/Point'
import { floor, half, mix, pick, range, repeat, rnd } from '../lib/util'
import { Overseer, Mutation, Mutator } from './Overseer'
import { Room } from './structures/Room'
import { Rect } from './Rectangle'

// stairs/connectors?
export function overworld(width = 60, height = 29) {
  const t = Date.now()
  ROT.RNG.setSeed(1234)
  console.log(ROT.RNG.getSeed())

  const grid = new Overseer(width, height, Terrain.void)

  const center = Pt(half(width), half(height))

  repeat(10, () => walk(grid.rndPt(), Terrain.grass, 400, grid.mutator())) // grass
  repeat(10, () => walk(grid.rndPt(), Terrain.deadGrass, 100, grid.mutator())) // dead grass

  // outer/inner space markers
  const levelRect = Rect.at(Pt(0, 0), width, height)
  const outer = levelRect.scale(-2)
  const inner = levelRect.scale(-6)

  // debug visual markers
  const mutMarkers = grid.mutator()
  outer.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))
  inner.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))

  // western lake
  const westLakePt = Pt(half(inner.x), rnd(inner.y, inner.y2))
  const westLakeMut = grid.mutator()
  repeat(30, () => walk(westLakePt, Terrain.water, 12, westLakeMut, { n: 2, s: 2 }))

  const nsPeak = grid.mutator()
  const nsMound = grid.mutator()
  for (const x of range(0, width - 1, 3)) {
    walk(Pt(x, outer.y), Terrain.peak, 2, nsPeak)
    walk(Pt(x, outer.y), Terrain.mound, 2, nsMound)
    walk(Pt(x, outer.y2), Terrain.mound, 2, nsMound)
    walk(Pt(x, outer.y2), Terrain.peak, 2, nsPeak)
  }

  const ewPeak = grid.mutator()
  const ewMound = grid.mutator()
  for (const y of range(0, height - 1, 3)) {
    walk(Pt(outer.x, y), Terrain.mound, 2, ewMound)
    walk(Pt(outer.x, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.mound, 2, ewMound)
  }

  const cornersPeak = grid.mutator()
  for (const pt of outer.scale(-3).cornerPts()) walk(pt, pick([Terrain.peak, Terrain.mound]), 10, cornersPeak)

  // scattered shrubs
  // repeat(5, () => sparseWalk(grid, Terrain.shrub, 5, innerRect.rndEdgePt()))

  // // smaller southern lake
  // const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  // repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  // ruined structures
  const inSpace = inner.width / 6
  const inX = inner.x
  const inX2 = inner.x2
  const structPts = mix([
    Pt(inX + inSpace, center.y + rnd(-2, 2)),
    Pt(inX + half(inner.width), center.y + rnd(-2, 2)),
    Pt(inX2 - inSpace, center.y + rnd(-2, 2)),
  ])

  // structure 1
  const bigRoom = new Room(rnd(11, 13), rnd(11, 13))
    .degradedFloor(Terrain.void, -1)
    .walls(10)
    .crumble(3)
    .door(Terrain.void)
  bigRoom.place(structPts[0], grid.mutator())

  // structure 2
  // const smallRoom = new Room(rnd(7, 9), rnd(7, 9)).degradedFloor(Terrain.void, -1).walls(10).crumble(2)
  // smallRoom.place(structPts[1], grid.mutator())

  // structure 3
  // sparseWalk(grid, Terrain.shrub, rnd(3, 6), structPts[2])
  // sparseWalk(grid, Terrain.tombstone, rnd(4, 8), structPts[2])
  // const col = grid.mutate()
  // col.set(structPts[2], Terrain.column)

  console.log(`Done: ${Date.now() - t}ms`)
  console.log('grid', grid)
  return grid
}

function walk(
  start: Point,
  type: EntityTemplate,
  life: number,
  mutator: Mutator,
  weighting?: { n?: number; e?: number; s?: number; w?: number }
) {
  let pt = Pt(start.x, start.y)
  // north, east, south, west
  const north = new Array(weighting?.n ?? 1).fill(Pt(0, -1))
  const east = new Array(weighting?.e ?? 1).fill(Pt(1, 0))
  const south = new Array(weighting?.s ?? 1).fill(Pt(0, 1))
  const west = new Array(weighting?.w ?? 1).fill(Pt(-1, 0))
  const moves = [...north, ...east, ...south, ...west]
  for (const i of range(life)) {
    const dir = pick(moves)
    pt = pt.add(dir)
    mutator.set(pt.s, type)
  }
}

// function sparseWalk(grid: Overseer, type: Entity, amount: number, start?: Point) {
//   const mutations = grid.mutate()
//   const pt = start ?? grid.internal.rndPt()
//   repeat(amount, () => mutations.set(pt.add(Pt(rnd(-4, 4), rnd(-4, 4))), type))
// }
