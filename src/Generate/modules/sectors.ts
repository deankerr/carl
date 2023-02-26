import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { shuffle, timer } from '../../lib/util'

// sweep a rect, finding each region that matches the predicate function
// ie. individual open cave sections
export function findSectors(rect: Rect, predicateFn: (pt: Point) => boolean) {
  const t = timer('find sectors')
  const checked = new Set<Point>()
  const sectors: Set<Point>[] = []

  const valid = (pt: Point) => {
    if (checked.has(pt)) return false
    checked.add(pt)
    return rect.pointIntersects(pt) && predicateFn(pt)
  }

  for (const pt of rect.each()) {
    if (!valid(pt)) continue

    const sector = new Set<Point>()
    sector.add(pt)

    for (const pt of sector) {
      for (const npt of pt.neighbours4()) if (valid(npt)) sector.add(npt)
    }

    sectors.push(sector)
  }

  t.stop(sectors.map((s, i) => `${i}: ${s.size}`))
  return sectors
}

// call the connect function for every point along the closest path between each sector
// (excluding the largest), which should connect all of them
export function connectSectors(
  rect: Rect,
  sectors: Set<Point>[],
  predicateFn: (pt: Point) => boolean,
  connectFn: (pt: Point) => unknown
) {
  const t = timer('connect sectors')
  const sorted = [...sectors].slice(0, sectors.length - 1).sort((a, b) => a.size - b.size)

  for (const sector of sorted) {
    const [pt, path] = findPathToClosest(rect, sector, predicateFn)
    const owner = sectors.find(s => s.has(pt))
    console.log('PATH:', path)
    for (const pt of path) {
      connectFn(pt)
      owner?.add(pt)
    }

    for (const pt of sector) owner?.add(pt)

    sector.clear()
  }

  t.stop()
}

// find the closest path between a set of points and a point where the predicate function returns
// true (ie. a cave section to another open area)
export function findPathToClosest(
  rect: Rect,
  start: Set<Point>,
  predicateFn: (pt: Point) => boolean
): [Point, Set<Point>] {
  const from = new Map<Point, Point>()
  const frontier = new Set<Point>([...shuffle([...start])])
  let found: Point | undefined

  const invalid = (pt: Point) => from.has(pt) || start.has(pt) || !rect.pointIntersects(pt)

  for (const pt of frontier) {
    for (const npt of pt.neighbours4()) {
      if (invalid(npt)) continue
      from.set(npt, pt)
      if (predicateFn(npt)) {
        found = npt
        break
      }
      frontier.add(npt)
    }
    if (found) break
  }

  if (!found) throw new Error('Failed to find goal.')

  const path = new Set<Point>([found])
  for (const pt of path) {
    const next = from.get(pt)
    if (next) path.add(next)
  }

  return [found, path]
}
