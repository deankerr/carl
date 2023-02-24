import { Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'

export const Constraints = {
  empty: function (d: DomainData) {
    return d.region.at(d.pt).length <= 1
  },
  walkable: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length === 0
  },
  isBlocked: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length > 0
  },
  isWall: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.wall).length > 0
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: DomainData) => boolean

export type ConstraintKey = keyof typeof Constraints

export type DomainData = {
  region: Region
  pt: Point
  domain: Set<Point>
}
