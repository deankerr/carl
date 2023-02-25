import { EntityKey, Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'

export const Constraints = {
  empty: function (d: DomainData) {
    return d.region.at(d.pt).length <= 1
  },
  walkable: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length === 0
  },
  wall: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.wall).length > 0
  },
  top: function (d: DomainData) {
    const [yMin] = [...d.domain].sort((a, b) => a.y - b.y)
    return d.pt.y === yMin.y
  },
  exposed: function (d: DomainData) {
    const tBelow = d.region.terrainAt(d.pt.south())
    return !tBelow.wall
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: DomainData) => boolean

export type ConstraintKey = keyof typeof Constraints

export type DomainData = {
  region: Region
  pt: Point
  domain: Set<Point>
  object: Map<Point, EntityKey[]>
  width: number
  height: number
}
