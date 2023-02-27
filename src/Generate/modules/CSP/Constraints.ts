import { Point } from '../../../lib/Shape/Point'
import { Problem } from './Solver'

export const Constraints = {
  empty: function (p: Problem, pt: Point) {
    return p.region.at(pt).length <= 1
  },

  vacant: function (p: Problem, pt: Point) {
    return !p.region.at(pt).some(e => e.being)
  },

  walkable: function (p: Problem, pt: Point) {
    return p.region.at(pt).filter(e => e.blocksMovement).length === 0
  },

  wall: function (p: Problem, pt: Point) {
    return p.region.at(pt).filter(e => e.wall).length > 0
  },

  floor: function (p: Problem, pt: Point) {
    return p.region.at(pt).filter(e => e.floor).length > 0
  },

  top: function (p: Problem, pt: Point) {
    const [yMin] = [...p.domain].sort((a, b) => a.y - b.y)
    return pt.y === yMin.y
  },

  exposed: function (p: Problem, pt: Point) {
    const tBelow = p.region.terrainAt(pt.south())
    return !tBelow.blocksMovement
  },

  corner: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return isCorner(neighbours)
  },

  cornerNorthWest: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NW[i])
  },

  cornerNorthEast: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NE[i])
  },

  cornerSouthWest: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SW[i])
  },

  cornerSouthEast: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SE[i])
  },

  hasWallNorth: function (p: Problem, pt: Point) {
    const north = p.region.terrainAt(pt.north())
    return north.wall === true
  },

  noAdjacentWall: function (p: Problem, pt: Point) {
    const neighbours = pt.neighbours().map(npt => p.region.terrainAt(npt))
    return !neighbours.some(e => e.wall)
  },
} satisfies Record<string, Constraint>

export type Constraint = (p: Problem, pt: Point) => boolean

export type ConstraintKey = keyof typeof Constraints

// identify corners
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
