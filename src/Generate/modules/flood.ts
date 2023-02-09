import { Entity, EntityKey, Region } from '../../Core'
import { loop, Queue, rnd, shuffle } from '../../lib/util'
import { point, Point, pointRect } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'
import { O2Module } from '../Overseer2'

export function* floodWalkable(startPt: Point, O2: O2Module) {
  const { region } = O2
  const queue = new Queue<Point>(startPt)
  const checked = new Set<Point>()
  const nextRing = new Set<Point>()

  while (queue.queue.length > 0) {
    const pt = queue.next()
    if (!pt) return startPt

    checked.add(pt)

    if (!region.terrainAt(pt).blocksMovement) {
      yield pt

      pt.neighbours8().forEach(npt => {
        if (!checked.has(npt) && !queue.queue.includes(npt)) {
          nextRing.add(npt)
        }
      })
    }

    if (queue.queue.length < 1) {
      queue.queue = shuffle([...nextRing])
      nextRing.clear()
    }
  }
  return startPt
}

export function rndCluster(amount: number, O2: O2Module) {
  const flood = floodWalkable(O2.region.rndWalkable(), O2)
  const results: Point[] = []
  loop(amount, () => {
    results.push(flood.next().value)
  })
  return results
}

export function floodFindRegions(rect: Rect, predicate: (pt: Point) => boolean) {
  let count = 0
  const region = new Map<Point, number>()
  rect.traverse(pt => {
    if (predicate(pt)) {
      region.set(pt, count)

      const set = new Set<Point>()
    } else region.set(pt, -1)
  })

  logPointMap(rect, region)
  return region
}

function logPointMap(rect: Rect, map: Map<Point, number>) {
  let row = 0
  let line = ''
  rect.traverse(pt => {
    if (pt.y !== row) {
      console.log(row < 10 ? ' ' + row : '' + row, line)
      row = pt.y
      line = ''
    }
    const n = `${map.get(pt) ?? '?'}`
    line += n === '-1' ? 'x' : n
  })
  console.log('' + row, line)
}
