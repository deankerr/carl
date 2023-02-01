import * as ROT from 'rot-js'
import { Point, point } from '../Model/Point'
import { half, pick, range, repeat, rnd, rndO } from '../lib/util'
import { Overseer, Mutator } from './Overseer'
import { Rect } from '../Model/Rectangle'
import { CONFIG } from '../config'
import { Structure } from './structures/Structure'
import { EntityKey, TerrainKey } from '../Core/Entity'

// stairs/connectors?
export function overworld(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const t = Date.now()

  console.groupCollapsed('Generate Overworld')
  console.log('seed state:', ROT.RNG.getState())

  const O = new Overseer(width, height, window.game.pool)

  // const center = Pt(half(width), half(height))

  repeat(10, () => walk(O.grid.rndPt(), 'grass', 400, O.mutate())) // grass
  repeat(10, () => walk(O.grid.rndPt(), 'deadGrass', 100, O.mutate())) // dead grass

  // outer/inner space markers
  const levelRect = Rect.at(point(0, 0), width, height)
  const outer = levelRect.scale(-1)
  const inner = levelRect.scale(-6)

  // western lake
  const westLakePt = point(half(inner.x), rnd(inner.y, inner.y2))
  const westLakeMut = O.mutate()
  repeat(30, () => walk(westLakePt, 'water', 12, westLakeMut, { n: 2, s: 2 }))

  // southern lake
  const southLakePt = point(rnd(levelRect.x, levelRect.x2), levelRect.y2 - 3)
  const southLakeMut = O.mutate()
  repeat(15, () => walk(southLakePt, 'water', 12, southLakeMut, { e: 2, w: 2 }))

  const nsPeak = O.mutate()
  const nsMound = O.mutate()
  for (const x of range(0, width - 1, 3)) {
    walk(point(x, outer.y), 'peak', 3, nsPeak)
    walk(point(x, outer.y), 'mound', 3, nsMound)
    walk(point(x, outer.y2), 'mound', 3, nsMound)
    walk(point(x, outer.y2), 'peak', 3, nsPeak)
  }

  const ewPeak = O.mutate()
  const ewMound = O.mutate()
  for (const y of range(0, height - 1, 3)) {
    walk(point(outer.x, y), 'mound', 2, ewMound)
    walk(point(outer.x, y), 'peak', 2, ewPeak)
    walk(point(outer.x2, y), 'peak', 2, ewPeak)
    walk(point(outer.x2, y), 'mound', 2, ewMound)
  }

  const cornersPeak = O.mutate()
  for (const pt of outer.scale(-3).cornerPts()) walk(pt, pick(['peak', 'mound']), 10, cornersPeak)

  // scattered shrubs
  // const shrubMut = O.mutate()
  repeat(5, () => sparseWalk(inner.rndEdgePt(), 'shrub', 5, O.mutate(), 'void'))

  // smaller southern lake
  // const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  // repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  const main = new Structure(inner, O)
  main.mark(true)
  const [main1, main2] = main.bisect()

  const [ruinsArea, featureArea] = ROT.RNG.shuffle([main1, main2])

  // * graveyard
  const graveyard = featureArea.center(9, 7)
  graveyard.degradedFloor('path', 1)

  graveyard.feature('tombstone', rnd(4, 8), 'void')
  graveyard.feature('statue', 2, 'void')

  featureArea.feature('deadTree', 6, 'void')

  // ruin
  const ruin = ruinsArea.center(rndO(13, 15), rndO(11, 13))
  ruin.walls()
  ruin.bisectRooms(rnd(2, 4))
  ruin.buildInnerWalls()
  ruin.connectInnerRooms()
  ruin.degradedFloor('void', 1)

  // add features to rooms
  const ruinRooms = ROT.RNG.shuffle([...ruin.innerRooms])
  ruinRooms.forEach((r, i) => {
    if (i === 0) {
      r.feature('flames', 1)
      // const stairPt = r.feature(Terrain.stairsDescending)
      // O.domainConnections.set(stairPt[0].s, 'dungeon')
      r.feature('stairsDown')
    } else {
      switch (i % 3) {
        case 1:
          r.feature(pick(['flames', 'flames']), 1)
          r.feature('ghost', 3)
          break
        case 2:
          r.feature('flames')
          r.feature('demon', 1)
      }
    }
  })

  ruin.createAnnex()?.walls()
  ruin.createAnnex()?.walls()

  // create/add features to annex room(s)
  ruin.sub.forEach((annex, i) => {
    annex.bisectRooms(rnd(1))
    annex.buildInnerWalls()
    annex.connectInnerRooms()
    annex.degradedFloor('void')

    if (i === 0) {
      const waterRoom = pick(annex.innerRooms)
      waterRoom.degradedFloor('water')
      waterRoom.feature('crab')
      waterRoom.feature('crab2')
    } else if (i === 1) {
      annex.degradedFloor('path')
    }
  })
  ruin.connectAnnexes()
  ruin.connectExternal(rnd(1, 2))

  console.log('ruin:', ruin)

  O.mutate().setE(outer.rndEdgePt(), 'player')
  // * End

  console.groupEnd()
  console.groupCollapsed(`Done: ${Date.now() - t}ms`)
  console.log(O)
  console.groupEnd()

  return O
}

function walk(
  start: Point,
  type: TerrainKey,
  life: number,
  mutator: Mutator,
  weighting?: { n?: number; e?: number; s?: number; w?: number }
) {
  let pt = point(start.x, start.y)
  // north, east, south, west
  const north = new Array(weighting?.n ?? 1).fill(point(0, -1))
  const east = new Array(weighting?.e ?? 1).fill(point(1, 0))
  const south = new Array(weighting?.s ?? 1).fill(point(0, 1))
  const west = new Array(weighting?.w ?? 1).fill(point(-1, 0))
  const moves = [...north, ...east, ...south, ...west]
  for (const i of range(life)) {
    const dir = pick(moves)
    pt = pt.add(dir)
    mutator.setT(pt, type)
    i // durr
  }
}

function sparseWalk(
  start: Point,
  type: EntityKey,
  amount: number,
  mutator: Mutator,
  terrain?: TerrainKey
) {
  repeat(amount, () => {
    const pt = start.add(point(rnd(-4, 4), rnd(-4, 4)))
    if (terrain) mutator.setT(pt, terrain)
    mutator.setE(pt, type)
  })
}
