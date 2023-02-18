import { Region } from '../../Core'
import { Point } from '../../lib/Shape/Point'

export const CSPConstraints = {
  isEmpty: function (region: Region, pt: Point) {
    return region.at(pt).length <= 1 // ???
  },
  isWall: function (region: Region, pt: Point) {
    return 'wall' in region.terrainAt(pt)
  },
  isNotWall: function (region: Region, pt: Point, domain: Point[]) {
    return this.isWall(region, pt, domain)
  },
  isFloor: function (region: Region, pt: Point) {
    return region.terrainAt(pt).floor === true
  },
  isDirtFloor: function (region: Region, pt: Point) {
    return region.terrainAt(pt).label.includes('dirtFloor')
  },
  isExposedWall: function (region: Region, pt: Point) {
    const t = region.terrainAt(pt)
    return 'wall' in t && 'isHorizontal' in t && !('wall' in region.terrainAt(pt.south()))
  },
  isNorthernWall: function (region: Region, pt: Point, domain: Point[]) {
    const ySorted = [...domain].sort((a, b) => a.y - b.y)
    console.log('ySorted:', ySorted)
    return pt.y === ySorted[0].y
  },
  isCorner: function (region: Region, pt: Point) {
    const neighbours = pt
      .neighbours4()
      .map(npt => region.terrainAt(npt))
      .filter(c => c.wall)
    console.log('neighbours:', neighbours)
    return neighbours.length === 2 // doorways could trigger this
  },
  isCenterAligned: function (region: Region, pt: Point) {
    return true // todo
  },
} as { [key: string]: (region: Region, pt: Point, domain: Point[]) => boolean }
