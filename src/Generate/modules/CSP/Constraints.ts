import { Problem } from './Solver'

export const Constraints = {
  empty: function (p: Problem) {
    return p.region.at(p.pt).length <= 1
  },

  walkable: function (p: Problem) {
    return p.region.at(p.pt).filter(e => e.blocksMovement).length === 0
  },

  wall: function (p: Problem) {
    return p.region.at(p.pt).filter(e => e.wall).length > 0
  },

  top: function (p: Problem) {
    const [yMin] = [...p.domain].sort((a, b) => a.y - b.y)
    return p.pt.y === yMin.y
  },

  exposed: function (p: Problem) {
    const tBelow = p.region.terrainAt(p.pt.south())
    return !tBelow.wall
  },

  corner: function (p: Problem) {
    const wall = p.pt
      .neighbours()
      .map(npt => p.region.terrainAt(npt).wall)
      .filter(n => n)
    // quick check, irregular terrain could trigger this
    return wall.filter(n => n).length === 5
  },

  cornerNorthWest: function (p: Problem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NW[i])
  },

  cornerNorthEast: function (p: Problem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NE[i])
  },

  cornerSouthWest: function (p: Problem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SW[i])
  },

  cornerSouthEast: function (p: Problem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SE[i])
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: Problem) => boolean

export type ConstraintKey = keyof typeof Constraints

const cornerMask = {
  NW: [true, false, false, true, true, false, true, true], // NW
  NE: [true, true, false, false, true, true, false, true], // NE
  SE: [false, true, true, false, true, true, true, false], // SE
  SW: [false, false, true, true, false, true, true, true], // SW
}
