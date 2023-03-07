import { Point } from './Shape/Point'
import { Rect } from './Shape/Rectangle'
import { shuffle } from './util'

export type RegionPredicate = (pt: Point) => boolean
export type OverseerCallback = (pt: Point) => unknown

export function select(rect: Rect, predicate: RegionPredicate) {
  const checked = new Set<Point>()
  const sectors: Set<Point>[] = []

  const invalid = (pt: Point) => checked.has(pt) || !rect.pointIntersects(pt) || !predicate(pt)

  for (const pt of rect.each()) {
    if (invalid(pt)) continue

    const sector = new Set<Point>()
    sector.add(pt)
    checked.add(pt)

    for (const pt of sector) {
      for (const npt of pt.neighbours4()) {
        if (invalid(npt)) continue
        sector.add(npt)
        checked.add(npt)
      }
    }

    sectors.push(sector)
  }

  return sectors.map(sector => [...sector])
}

export function findPath(
  rect: Rect,
  start: Point[],
  predicate: RegionPredicate,
  pathable: RegionPredicate
) {
  const cameFrom = new Map<Point, Point>()
  const initial = new Set<Point>(start)
  const frontier = new Set<Point>(shuffle(start))
  let found: Point | undefined

  const invalid = (pt: Point) =>
    cameFrom.has(pt) || initial.has(pt) || !pathable(pt) || !rect.pointIntersects(pt)

  for (const pt of frontier) {
    for (const npt of pt.neighbours4()) {
      if (invalid(npt)) continue

      cameFrom.set(npt, pt)

      if (predicate(npt)) {
        found = npt
        break
      }

      frontier.add(npt)
    }

    if (found) break
  }

  if (!found) throw new Error('Failed to find goal.')

  // construct path
  const path = [found]
  for (const pt of path) {
    const next = cameFrom.get(pt)
    if (next) path.push(next)
  }

  return path
}

export function connectAll(
  rect: Rect,
  sectors: Point[][],
  pathable: RegionPredicate,
  connect: OverseerCallback
) {
  let [connected, ...unconnected] = sectors

  while (unconnected.length > 0) {
    const path = findPath(
      rect,
      connected,
      pt => unconnected.some(sector => sector.includes(pt)),
      pathable
    )

    const pt = path[0]
    const found = unconnected.find(sector => sector.includes(pt)) ?? []
    connected = [...connected, ...found]
    unconnected = unconnected.filter(sector => sector !== found)

    for (const pt of path) {
      connect(pt)
    }
  }
}
