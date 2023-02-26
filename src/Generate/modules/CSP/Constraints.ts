import { CProblem } from './Solver'

export const Constraints = {
  empty: function (p: CProblem) {
    return p.region.at(p.pt).length <= 1
  },

  walkable: function (p: CProblem) {
    return p.region.at(p.pt).filter(e => e.blocksMovement).length === 0
  },

  wall: function (p: CProblem) {
    return p.region.at(p.pt).filter(e => e.wall).length > 0
  },

  top: function (p: CProblem) {
    const [yMin] = [...p.domain].sort((a, b) => a.y - b.y)
    return p.pt.y === yMin.y
  },

  exposed: function (p: CProblem) {
    const tBelow = p.region.terrainAt(p.pt.south())
    return !tBelow.wall
  },

  corner: function (p: CProblem) {
    const wall = p.pt
      .neighbours()
      .map(npt => p.region.terrainAt(npt).wall)
      .filter(n => n)
    // quick check, irregular terrain could trigger this
    return wall.filter(n => n).length === 5
  },

  cornerNorthWest: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NW[i])
  },

  cornerNorthEast: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NE[i])
  },

  cornerSouthWest: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SW[i])
  },

  cornerSouthEast: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SE[i])
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: CProblem) => boolean

export type ConstraintKey = keyof typeof Constraints

const cornerMask = {
  NW: [true, false, false, true, true, false, true, true], // NW
  NE: [true, true, false, false, true, true, false, true], // NE
  SE: [false, true, true, false, true, true, true, false], // SE
  SW: [false, false, true, true, false, true, true, true], // SW
}
