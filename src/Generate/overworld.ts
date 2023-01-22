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

  repeat(10, () => walk(grid, Terrain.grass, 500))
  repeat(10, () => walk(grid, Terrain.deadGrass, 100))

  const mmut = grid.mutate()
  const outskirtsRect = Rect.at(Pt(0, 0), width, height).scale(-2)
  const outSkirtsPts = outskirtsRect.toPts(true)
  const innerRect = outskirtsRect.scale(-5)
  const innerPts = innerRect.toPts(true)

  // debug visual markers
  // outSkirtsPts.forEach(pt => mmut.set(pt, Terrain.path))
  // innerPts.forEach(pt => mmut.set(pt, Terrain.path))

  // outskirt decoration
  outskirtsRect.traverse((pt, edge) => {
    if (edge) {
      // many mounds, some peaks in the north
      if (pt.y === outskirtsRect.y) {
        if (!rnd(3)) walk(grid, Terrain.peak, 12, pt)
        if (!rnd(1)) walk(grid, Terrain.mound, 12, pt)
      }

      // fewer mounds, more peaks in the south
      if (pt.y === outskirtsRect.y2) {
        if (!rnd(2)) walk(grid, Terrain.peak, 12, pt)
        if (!rnd(8)) walk(grid, Terrain.mound, 12, pt)
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

  // western lake
  const westLakePt = Pt(outskirtsRect.x, center.y + rnd(-5, 5))
  repeat(4, () => walk(grid, Terrain.water, 30, westLakePt))

  // smaller southern lake
  const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  // ruined structures
  const inSpace = innerRect.width / 4
  const inX = innerRect.x
  const structPts = mix([
    Pt(inX + inSpace, center.y + rnd(-4, 4)),
    Pt(inX + inSpace * 2, center.y + rnd(-4, 4)),
    Pt(inX + inSpace * 3, center.y + rnd(-4, 4)),
  ])

  const bigRoom = new Room({ floor: 'none', minWidth: 9, minHeight: 7, maxWidth: 13, maxHeight: 11 }).crumble(2)
  const smallRoom = new Room({ floor: 'none', minWidth: 7, minHeight: 5, maxWidth: 9, maxHeight: 7 }).crumble(2)

  grid.mutate(bigRoom.place(structPts[0]))
  grid.mutate(smallRoom.place(structPts[1]))

  // const room = new Room({ floor: 'none', minWidth: 7, minHeight: 5, maxWidth: 11, maxHeight: 9 }).crumble().door()
  // grid.mutate(room.place(center))

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

/*



*/

// const aroom = createRoom()
// console.log('aroom:', aroom)
// const mutRoom = grid.mutate()
// aroom.forEach((t, p) => mutRoom.set(center.add(p), t))

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
