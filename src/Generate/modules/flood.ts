import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'

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
      for (const npt of pt.neighbours()) if (valid(npt)) sector.add(npt)
    }

    sectors.push(sector)
  }

  console.log(`findSectors: ${Date.now() - t}ms`)
  return sectors
}
