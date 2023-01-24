/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ROT from 'rot-js'
import { Terrain, Features, randomFlameTemplate, Marker } from '../Templates'
import { EntityTemplate } from '../Core/Entity'
import { Point, Pt } from '../Model/Point'
import { half, mix, pick, range, repeat, rnd, rndO, str } from '../lib/util'
import { Overseer, Mutator } from './Overseer'
import { RoomBuilder, Room } from './structures/Room'
import { Rect } from '../Model/Rectangle'
import { CONFIG } from '../config'
import { Structure } from './structures/Structure'

// stairs/connectors?
export function overworld(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const t = Date.now()
  // ROT.RNG.setSeed(1234)
  // console.log(ROT.RNG.getSeed())

  const grid = new Overseer(width, height, Terrain.void)

  const center = Pt(half(width), half(height))

  const grassMut = grid.mutate()
  const dGrassMut = grid.mutate()
  repeat(10, () => walk(grid.rndPt(), Terrain.grass, 400, grassMut)) // grass
  repeat(10, () => walk(grid.rndPt(), Terrain.deadGrass, 100, dGrassMut)) // dead grass

  // outer/inner space markers
  const levelRect = Rect.at(Pt(0, 0), width, height)
  const outer = levelRect.scale(-1)
  const inner = levelRect.scale(-6)

  // // debug visual markers
  // const mutMarkers = grid.mutate()
  // outer.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))
  // inner.traverse((pt, edge) => (edge ? mutMarkers.set(pt, Terrain.path) : ''))

  // western lake
  const westLakePt = Pt(half(inner.x), rnd(inner.y, inner.y2))
  const westLakeMut = grid.mutate()
  repeat(30, () => walk(westLakePt, Terrain.water, 12, westLakeMut, { n: 2, s: 2 }))

  const nsPeak = grid.mutate()
  const nsMound = grid.mutate()
  for (const x of range(0, width - 1, 3)) {
    walk(Pt(x, outer.y), Terrain.peak, 3, nsPeak)
    walk(Pt(x, outer.y), Terrain.mound, 3, nsMound)
    walk(Pt(x, outer.y2), Terrain.mound, 3, nsMound)
    walk(Pt(x, outer.y2), Terrain.peak, 3, nsPeak)
  }

  const ewPeak = grid.mutate()
  const ewMound = grid.mutate()
  for (const y of range(0, height - 1, 3)) {
    walk(Pt(outer.x, y), Terrain.mound, 2, ewMound)
    walk(Pt(outer.x, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.peak, 2, ewPeak)
    walk(Pt(outer.x2, y), Terrain.mound, 2, ewMound)
  }

  const cornersPeak = grid.mutate()
  for (const pt of outer.scale(-3).cornerPts()) walk(pt, pick([Terrain.peak, Terrain.mound]), 10, cornersPeak)

  // scattered shrubs
  const shrubMut = grid.mutate()
  repeat(5, () => sparseWalk(inner.rndEdgePt(), Features.shrub, 5, shrubMut))

  // smaller southern lake
  // const southLakePt = Pt(center.x + rnd(-4, -4), outskirtsRect.y2)
  // repeat(2, () => walk(grid, Terrain.water, 20, southLakePt))

  const main = new Structure(inner, grid)
  main.bisect()

  const ruinW = rndO(13, 15)
  const ruinH = rndO(11, 13)
  const ruin = main.sub[rnd(1)].inner(ruinW, ruinH)
  // const ruin = main.sub[1].inner(rnd(13, 17), rnd(9, 15))
  ruin.walls()
  console.log('ruin:', ruin)

  const min = 5
  const minSplit = half(min)
  const done: Rect[] = []
  const walls: Rect[] = []

  bsp(ruin.rect.scale(-1))
  console.log('done:', done)

  const mut = grid.mutate()
  done.forEach(r => {
    const mark = Marker()
    r.traverse(pt => mut.visual(pt, mark))
  })
  const markW = { ...Marker(), color: 'magenta' }
  walls.forEach(r => r.traverse(pt => mut.visual(pt, markW)))

  function bsp(startRect: Rect) {
    const rects = [startRect]
    repeat(rnd(3, 6), i => {
      console.log('bsp loop', i)
      const r = rects.shift()
      if (!r) {
        console.log('no more rects!')
        return true
      }

      const canSplitV = r.width >= min
      const canSplitH = r.height >= min

      let dir = rnd(1) ? 'vert' : 'hori'
      if (!canSplitV && !canSplitH) {
        console.log('rect', i, 'done!', r)
        done.push(r)
        return
      }

      if (canSplitV && canSplitH) dir = rnd(1) ? 'vert' : 'hori'
      else if (canSplitV) dir = 'vert'
      else dir = 'hori'

      // choose bisect point along top or left edge
      const split = dir === 'vert' ? rnd(r.x + minSplit, r.x2 - minSplit) : rnd(r.y + minSplit, r.y2 - minSplit)

      //create two sub rects, and a border rect
      const sub1 =
        dir === 'vert' ? Rect.atxy2(Pt(r.x, r.y), Pt(split - 1, r.y2)) : Rect.atxy2(Pt(r.x, r.y), Pt(r.x2, split - 1))

      const sub2 =
        dir === 'vert' ? Rect.atxy2(Pt(split + 1, r.y), Pt(r.x2, r.y2)) : Rect.atxy2(Pt(r.x, split + 1), Pt(r.x2, r.y2))

      const subW = dir === 'vert' ? Rect.at(Pt(split, r.y), 1, r.height) : Rect.at(Pt(r.x, split), r.width, 1)
      rects.push(sub1, sub2)
      walls.push(subW)
      return false
    })
    done.push(...rects)
  }

  // const ruinsInner = ruin.shell()

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
