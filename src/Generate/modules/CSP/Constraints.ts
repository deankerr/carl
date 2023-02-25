import { Problem } from './Solver'

export const Constraints = {
  empty: function (d: Problem) {
    return d.region.at(d.pt).length <= 1
  },
  walkable: function (d: Problem) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length === 0
  },
  wall: function (d: Problem) {
    return d.region.at(d.pt).filter(e => e.wall).length > 0
  },
  top: function (d: Problem) {
    const [yMin] = [...d.domain].sort((a, b) => a.y - b.y)
    return d.pt.y === yMin.y
  },
  exposed: function (d: Problem) {
    const tBelow = d.region.terrainAt(d.pt.south())
    return !tBelow.wall
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: Problem) => boolean

export type ConstraintKey = keyof typeof Constraints
