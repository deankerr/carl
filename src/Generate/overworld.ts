import * as ROT from 'rot-js'
import { Terrain, Features, Beings } from '../Templates'
import { EntityTemplate } from '../Core/Entity'
import { Point, Pt } from '../Model/Point'
import { half, pick, range, repeat, rnd, rndO } from '../lib/util'
import { Overseer, Mutator } from './Overseer'
import { Rect } from '../Model/Rectangle'
import { CONFIG } from '../config'
import { Structure } from './structures/Structure'

// stairs/connectors?
export function overworld(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const t = Date.now()

  // ROT.RNG.setState([0.5747384100686759, 0.7194003688637167, 0.938015446998179, 427068])
  // console.log(ROT.RNG.getSeed())
  console.log(ROT.RNG.getState())

  const O = new Overseer(width, height)

  // const center = Pt(half(width), half(height))

  const grassMut = O.mutate()
  const dGrassMut = O.mutate()
  repeat(10, () => walk(O.grid.rndPt(), Terrain.grass, 400, grassMut)) // grass
  repeat(10, () => walk(O.grid.rndPt(), Terrain.deadGrass, 100, dGrassMut)) // dead grass

  // outer/inner space markers
  const levelRect = Rect.at(Pt(0, 0), width, height)
  const outer = levelRect.scale(-1)
  const inner = levelRect.scale(-6)

  // // debug visual markers
  // const mutMarkers = O.mutate()
  // outer.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Features.debugMarker) : ''))
  // inner.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Features.debugMarker) : ''))

  // western lake
  const westLakePt = Pt(half(inner.x), rnd(inner.y, inner.y2))
  const westLakeMut = O.mutate()
  repeat(30, () => walk(westLakePt, Terrain.water, 12, westLakeMut, { n: 2, s: 2 }))

  // southern lake
  const southLakePt = Pt(rnd(levelRect.x, levelRect.x2), levelRect.y2 - 3)
  const southLakeMut = O.mutate()
  repeat(15, () => walk(southLakePt, Terrain.water, 12, southLakeMut, { e: 2, w: 2 }))

  const nsPeak = O.mutate()
  const nsMound = O.mutate()
  for (const x of range(0, width - 1, 3)) {
    walk(Pt(x, outer.y), Terrain.peak, 3, nsPeak)
    walk(Pt(x, outer.y), Terrain.mound, 3, nsMound)
    walk(Pt(x, outer.y2), Terrain.mound, 3, nsMound)
    walk(Pt(x, outer.y2), Terrain.peak, 3, nsPeak)
  }

  const ewPeak = O.mutate()
  const ewMound = O.mutate()
  for (const y of range(0, height - 1, 3)) {
    walk(Pt(outer.x, y), Terrain.mound, 2, ewMound)
    walk(Pt(outer.x, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.mound, 2, ewMound)
  }

  const cornersPeak = O.mutate()
  for (const pt of outer.scale(-3).cornerPts()) walk(pt, pick([Terrain.peak, Terrain.mound]), 10, cornersPeak)

  // scattered shrubs
  const shrubMut = O.mutate()
  repeat(5, () => sparseWalk(inner.rndEdgePt(), Features.shrub, 5, shrubMut))

  // smaller southern lake
  // const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  // repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  const main = new Structure(inner, O)
  main.mark(true)
  const [main1, main2] = main.bisect()

  const [ruinsArea, featureArea] = ROT.RNG.shuffle([main1, main2])
  ruinsArea.mark(true)
  featureArea.mark(true)

  const ruinW = rndO(13, 15)
  const ruinH = rndO(11, 13)
  const ruin = ruinsArea.inner(ruinW, ruinH)
  ruin.walls()
  ruin.bisectRooms(rnd(2, 5))
  ruin.buildInnerWalls()
  ruin.connectInnerRooms()
  ruin.degradedFloor(
    [Terrain.path, Terrain.crackedPath1, Terrain.crackedPath2, Terrain.crackedPath3, Terrain.crackedPath4],
    1
  )
  const ruinRooms = ROT.RNG.shuffle([...ruin.innerRooms])
  ruinRooms.forEach((r, i) => {
    if (i === 0) {
      r.feature(Features.magentaFlames, 1)
      r.feature(Terrain.stairsDescending)
    } else {
      switch (i % 3) {
        case 1:
          r.feature(pick([Features.cyanFlames, Features.greenFlames]), 1)
          r.feature(Beings.ghost, 3)
          break
        case 2:
          r.feature(Features.flames)
          r.feature(Beings.demon, 1)
      }
    }
  })

  ruin.createAnnex(rndO(7, 9), rndO(7, 9), main.rect)

  if (ruin.sub[0]) {
    const annex = ruin.sub[0]
    annex.walls()
    annex.bisectRooms(rnd(1, 2))
    annex.buildInnerWalls()
    annex.connectInnerRooms()
    annex.degradedFloor(Terrain.void)

    const waterRoom = pick(annex.innerRooms)
    waterRoom.degradedFloor(Terrain.water)
    waterRoom.feature(Beings.crab)
    waterRoom.feature(Beings.crab2)
  }
  ruin.connectAnnexes()
  ruin.connectExternal(rnd(1, 2))

  console.log('ruin:', ruin)

  const graveyard = featureArea.center(9, 7)
  graveyard.degradedFloor(
    [Terrain.path, Terrain.crackedPath1, Terrain.crackedPath2, Terrain.crackedPath3, Terrain.crackedPath4],
    1
  )

  graveyard.feature(Features.tombstone, rnd(4, 8))
  graveyard.feature(Features.statue, 2)

  featureArea.feature(Features.deadTree, 6, Terrain.void)

  O.mutate().set(outer.rndEdgePt(), Beings.player)
  // * End
  console.log(`Overworld done: ${Date.now() - t}ms`, O)
  return O
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

function sparseWalk(start: Point, type: EntityTemplate, amount: number, mutator: Mutator, terrain?: EntityTemplate) {
  repeat(amount, () => {
    const pt = start.add(Pt(rnd(-4, 4), rnd(-4, 4)))
    if (terrain) mutator.set(pt, terrain)
    mutator.set(pt, type)
  })
}
