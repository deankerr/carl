import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { ltimer } from '../../lib/util'

export function findSectors(rect: Rect, predicateFn: (pt: Point) => boolean) {
  const t = Date.now()
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

  console.log(`findSectors: ${Date.now() - t}ms`)
  return sectors
}

export function findPathToClosest(
  rect: Rect,
  start: Set<Point>,
  predicateFn: (pt: Point) => boolean
): [Point, Set<Point>] {
  const t = ltimer('find path')
  const from = new Map<Point, Point>()
  const frontier = new Set<Point>([...start])
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

  const goalPath = new Set<Point>([found])
  for (const pt of goalPath) {
    const next = from.get(pt)
    if (next) goalPath.add(next)
  }
  t.stop()
  return [found, goalPath]
}
