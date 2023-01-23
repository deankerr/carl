/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ROT from 'rot-js'
import { Terrain, Features, randomFlameTemplate } from '../Templates'
import { EntityTemplate } from '../Core/Entity'
import { Point, Pt } from '../Model/Point'
import { half, mix, pick, range, repeat, rnd, rndO } from '../lib/util'
import { Overseer, Mutator } from './Overseer'
import { RoomBuilder, Room } from './structures/Room'
import { Rectangle } from '../Model/Rectangle'
import { CONFIG } from '../config'
import { Structure } from './structures/Structure'

// stairs/connectors?
export function overworld(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const t = Date.now()
  // ROT.RNG.setSeed(1234)
  // console.log(ROT.RNG.getSeed())

  const grid = new Overseer(width, height, Terrain.void)

  const center = Pt(half(width), half(height))

  // repeat(10, () => walk(grid.rndPt(), Terrain.grass, 400, grid.mutate())) // grass
  // repeat(10, () => walk(grid.rndPt(), Terrain.deadGrass, 100, grid.mutate())) // dead grass

  // outer/inner space markers
  const levelRect = Rectangle.at(Pt(0, 0), width, height)
  const outer = levelRect.scale(-1)
  const inner = levelRect.scale(-6)

  // // debug visual markers
  // const mutMarkers = grid.mutate()
  // outer.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))
  // inner.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))

  // // western lake
  // const westLakePt = Pt(half(inner.x), rnd(inner.y, inner.y2))
  // const westLakeMut = grid.mutate()
  // repeat(30, () => walk(westLakePt, Terrain.water, 12, westLakeMut, { n: 2, s: 2 }))

  // const nsPeak = grid.mutate()
  // const nsMound = grid.mutate()
  // for (const x of range(0, width - 1, 3)) {
  //   walk(Pt(x, outer.y), Terrain.peak, 3, nsPeak)
  //   walk(Pt(x, outer.y), Terrain.mound, 3, nsMound)
  //   walk(Pt(x, outer.y2), Terrain.mound, 3, nsMound)
  //   walk(Pt(x, outer.y2), Terrain.peak, 3, nsPeak)
  // }

  // const ewPeak = grid.mutate()
  // const ewMound = grid.mutate()
  // for (const y of range(0, height - 1, 3)) {
  //   walk(Pt(outer.x, y), Terrain.mound, 2, ewMound)
  //   walk(Pt(outer.x, y), Terrain.peak, 2, ewPeak)
  //   walk(Pt(outer.x2, y), Terrain.peak, 2, ewPeak)
  //   walk(Pt(outer.x2, y), Terrain.mound, 2, ewMound)
  // }

  // const cornersPeak = grid.mutate()
  // for (const pt of outer.scale(-3).cornerPts()) walk(pt, pick([Terrain.peak, Terrain.mound]), 10, cornersPeak)

  // // scattered shrubs
  // const shrubMut = grid.mutate()
  // repeat(5, () => sparseWalk(inner.rndEdgePt(), Features.shrub, 5, shrubMut))

  // // smaller southern lake
  // const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  // repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  // ruined structures

  // const structPts = mix([
  //   Pt(inX + inSpace, center.y + rnd(-2, 2)),
  //   Pt(inX + half(inner.width), center.y + rnd(-2, 2)),
  //   Pt(inX2 - inSpace, center.y + rnd(-2, 2)),
  // ])

  // structure 1
  // const ruinPt = center.add('-18,0')
  // const ruinPt = center.add(rnd(-5, 5), rnd(-3, 3))

  // const ruin = Room(rndO(11, 13), rnd(9, 11))
  //   .walls(0)
  //   .door(Terrain.void)
  //   .door(Terrain.void)
  //   .door(Terrain.void)
  //   .degradedFloor(Terrain.void, -1)

  // repeat(rnd(1, 2), () => {
  //   ruin.divide()
  // })

  // repeat(rnd(1, 2), () => {
  //   ruin.externalAnnex()
  // })

  // ruin.children.forEach(c => {
  //   c.walls().degradedFloor(Terrain.void, -1).door(Terrain.void)
  //   if (rnd(1)) c.add(randomFlameTemplate())
  // })

  // ruin.place(ruinPt, grid.mutate())
  // console.log('ruin:', ruin)

  const main = new Structure(inner, grid)
  const [sub1, sub2] = main.bisect()

  const ruin = rnd(1) ? sub1.inner(17, 11) : sub2.inner(17, 11)
  ruin.walls()

  // const ruinsInner = ruin.shell()

  const [inner1, inner2, innerWall] = ruin.bisect()
  innerWall.walls()

  const [room1, room2, roomsInnerWall] = rnd(1) ? inner1.bisect() : inner2.bisect()
  roomsInnerWall.walls()

  const [lilRoom1, lilRoom2, lilWall] = rnd(1) ? room1.bisect() : room2.bisect()
  lilWall.walls()

  // * End
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
    i // durr
  }
}

function sparseWalk(start: Point, type: EntityTemplate, amount: number, mutator: Mutator) {
  repeat(amount, () => mutator.set(start.add(Pt(rnd(-4, 4), rnd(-4, 4))), type))
}
