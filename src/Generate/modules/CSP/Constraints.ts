import { CProblem } from './Solver'

export const Constraints = {
  empty: function (p: CProblem) {
    return p.region.at(p.pt).length <= 1
  },

  vacant: function (p: CProblem) {
    return !p.region.at(p.pt).some(e => e.being)
  },

  walkable: function (p: CProblem) {
    return p.region.at(p.pt).filter(e => e.blocksMovement).length === 0
  },

  wall: function (p: CProblem) {
    return p.region.at(p.pt).filter(e => e.wall).length > 0
  },

  floor: function (p: CProblem) {
    return p.region.at(p.pt).filter(e => e.floor).length > 0
  },

  top: function (p: CProblem) {
    const [yMin] = [...p.domain].sort((a, b) => a.y - b.y)
    return p.pt.y === yMin.y
  },

  exposed: function (p: CProblem) {
    const tBelow = p.region.terrainAt(p.pt.south())
    return !tBelow.blocksMovement
  },

  corner: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return isCorner(neighbours)
  },

  cornerNorthWest: function (p: CProblem) {
    const neighbours = p.pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NW[i])
  },

  cornerNorthEast: function (p: CProblem) {
    const neighbours = p.pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NE[i])
  },

  cornerSouthWest: function (p: CProblem) {
    const neighbours = p.pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SW[i])
  },

  cornerSouthEast: function (p: CProblem) {
    const neighbours = p.pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SE[i])
  },

  hasWallNorth: function (p: CProblem) {
    const north = p.region.terrainAt(p.pt.north())
    return north.wall === true
  },

  noAdjacentWall: function (p: CProblem) {
    const neighbours = p.pt.neighbours().map(npt => p.region.terrainAt(npt))
    return !neighbours.some(e => e.wall)
  },
} satisfies Record<string, Constraint>

export type Constraint = (d: CProblem) => boolean

export type ConstraintKey = keyof typeof Constraints

function isCorner(wallNeighbours: boolean[], type?: keyof typeof cornerMask) {
  if (type) return wallNeighbours.every((n, i) => n === cornerMask[type][i])
  else return Object.values(cornerMask).some(mask => mask.every((m, i) => m === wallNeighbours[i]))
}

const cornerMask = {
  NW: [true, false, false, true], // NW
  NE: [true, true, false, false], // NE
  SE: [false, true, true, false], // SE
  SW: [false, false, true, true], // SW
}
