import { Point } from '../../../lib/Shape/Point'
import { Assignment } from './solve'

export const Constraints = {
  empty: function (p: Assignment, pt: Point) {
    return p.region.at(pt).length <= 1
  },

  vacant: function (p: Assignment, pt: Point) {
    return !p.region.at(pt).some(e => e.being)
  },

  walkable: function (p: Assignment, pt: Point) {
    return p.region.at(pt).filter(e => e.blocksMovement).length === 0
  },

  wall: function (p: Assignment, pt: Point) {
    return p.region.at(pt).filter(e => e.wall).length > 0
  },

  floor: function (p: Assignment, pt: Point) {
    return p.region.terrainAt(pt).floor === true
  },

  top: function (p: Assignment, pt: Point) {
    const [yMin] = [...p.domain].sort((a, b) => a.y - b.y)
    return pt.y === yMin.y
  },

  exposed: function (p: Assignment, pt: Point) {
    const tBelow = p.region.terrainAt(pt.south())
    return !tBelow.blocksMovement
  },

  corner: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours().map(npt => p.region.terrainAt(npt).wall === true)
    return isCorner(neighbours)
  },

  cornerNorthWest: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NW[i])
  },

  cornerNorthEast: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.NE[i])
  },

  cornerSouthWest: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SW[i])
  },

  cornerSouthEast: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours4().map(npt => p.region.terrainAt(npt).wall === true)
    return neighbours.every((n, i) => n === cornerMask.SE[i])
  },

  hasWallNorth: function (p: Assignment, pt: Point) {
    const north = p.region.terrainAt(pt.north())
    return north.wall === true
  },

  noAdjacentWall: function (p: Assignment, pt: Point) {
    const neighbours = pt.neighbours().map(npt => p.region.terrainAt(npt))
    return !neighbours.some(e => e.wall)
  },

  adjacentBuilding: function (p: Assignment, pt: Point) {
    return p.region.terrainAt(pt.west()).key === 'buildingWindow'
  },

  centerX: function (p: Assignment, pt: Point) {
    if (!p.rect) return false
    const domainCenterX = p.rect.x + p.rect.width / 2
    const objectHalf = p.object.width / 2
    return pt.x === domainCenterX - objectHalf
  },

  centerY: function (p: Assignment, pt: Point) {
    if (!p.rect) return false
    const domainCenterY = p.rect.y + p.rect.height / 2
    const objectHalf = p.object.height / 2
    return pt.y === domainCenterY - objectHalf
  },
} satisfies Record<string, Constraint>

export type Constraint = (p: Assignment, pt: Point) => boolean

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
