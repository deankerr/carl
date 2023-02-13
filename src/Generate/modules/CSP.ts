import { EntityKey, Region } from '../../Core'
import { pick, shuffle } from '../../lib/util'
import { Point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

// states -
//  empty: cell is free and can receive object,
//  margin: cell is free and should stay free (ie.doorway)
//  full: cell has received object

type CSPCell = {
  state: 'empty' | 'margin' | 'full'
  terrain: EntityKey
  entities: EntityKey[]
  isWall: boolean
  isDoor: boolean
  isOutOfBounds: boolean
}

function createCSPCell(): CSPCell {
  return {
    state: 'empty',
    terrain: 'nothing',
    entities: [],
    isWall: false,
    isDoor: false,
    isOutOfBounds: false,
  }
}

export class ConstraintSatisfactionProblemSolver {
  cellMap = new Map<Point, CSPCell>()
  constructor(readonly region: Region) {
    // ?
  }

  createCell(pt: Point) {
    const cell = createCSPCell()
    this.cellMap.set(pt, cell)
    return cell
  }

  getCell(pt: Point) {
    const cell = this.cellMap.get(pt)
    if (!cell) {
      // ? return full cell if oob?
      const oobCell = createCSPCell()
      oobCell.state = 'full'
      oobCell.isOutOfBounds = true
      return oobCell
    }
    return cell
  }

  each(callback: (pt: Point, cell: CSPCell) => unknown) {
    for (const [pt, cell] of this.cellMap) {
      callback(pt, cell)
    }
  }

  initializeRect(rect: Rect) {
    rect.traverse(pt => {
      const cell = this.createCell(pt)
      const [terrainHere, ...entitiesHere] = this.region.at(pt)
      cell.terrain = terrainHere.label as EntityKey
      cell.isWall = terrainHere.wall === true
      cell.isDoor = entitiesHere.filter(e => e.door).length > 0
    })
  }

  debugLogPointMap() {
    console.groupCollapsed('Cell Map')
    for (const [pt, cell] of this.cellMap) {
      console.log(pt, cell)
    }
    console.groupEnd()
  }

  tryObject(key: keyof typeof cspObjects, attempts = 1) {
    const domain = shuffle([...this.cellMap.keys()])
    const { entity, constraint } = cspObjects[key]
    console.log('CSP:', key, entity, constraint)
    let attempt = 0

    while (attempt++ < attempts) {
      let successPt: Point | undefined

      for (const pt of domain) {
        let satisfies = true

        for (const c of constraint) {
          const result = this.assessConstraint(c, pt)
          console.log('constraint', c, result)
          if (!result) {
            satisfies = false
            break
          }
        }
        if (satisfies) {
          successPt = pt
          break
        }
      }

      if (!successPt) {
        console.error('CSP: unable to satisfy constraints')
        return
      }

      const cell = this.getCell(successPt)
      cell.entities.push(pick(entity))
      cell.state = 'full'

      console.log('CSP Success:', successPt, cell)
    }
  }

  tryBigObject(key: keyof typeof cspObjects, amount = 1) {
    const domain = shuffle([...this.cellMap.keys()])
    const { entity, constraint, box } = cspObjects[key]
    console.log('CSP BIG!:', key, entity, constraint, box)
    let successes = 0

    for (const pt of domain) {
      // assess constraints for each char in box
      console.log('Assess pt:', pt.s, 'attempt:', successes)
      let satisfies = true
      this.forCellGrid(pt, box, relPt => {
        for (const c of constraint) {
          satisfies = this.assessConstraint(c, relPt)
          console.log('satisfies:', satisfies)
          if (!satisfies) return false
        }
        return true
      })

      if (!satisfies) {
        console.log('Failed')
        continue
      }

      console.log('Success, apply entities')
      // success
      this.forCellGrid(pt, box, (_relPt, cell, gridValue) => {
        if (gridValue !== 'x') {
          const i = parseInt(gridValue)
          if (Number.isNaN(i) || entity[i] === undefined) {
            throw new Error(`CSP: Invalid grid value ${i} / ${entity[i]}`)
          }

          cell.state = 'full'
          cell.entities.push(entity[i])
        }
      })

      successes++
      if (successes >= amount) break
    }

    if (successes === 0) console.error('CSP Failed to solve:', key)
  }

  forCellGrid(
    pt: Point,
    grid: string[],
    callback: (pt: Point, cell: CSPCell, gridValue: string) => unknown
  ) {
    for (let yi = 0; yi < grid.length; yi++) {
      console.log('grid row:', grid[yi])
      for (let xi = 0; xi < grid[yi].length; xi++) {
        const relPt = pt.add(xi, yi)
        if (callback(relPt, this.getCell(relPt), grid[yi][xi]) === false) return
      }
    }
  }

  assessConstraint(constraint: Constraint, pt: Point) {
    switch (constraint) {
      case 'isFloor':
        return this.constraintIsFloor(pt)
      case 'isDirtFloor':
        return this.constraintIsDirtFloor(pt)
      case 'cellIsEmpty':
        return this.constraintCellIsEmpty(pt)
      case 'isCorner':
        return this.constraintIsCorner(pt)
      case 'isNorthernExposedWall':
        return this.constraintIsNorthernExposedWall(pt)
      default:
        throw new Error('Unknown constraint')
    }
  }

  constraintCellIsEmpty(pt: Point) {
    const cell = this.getCell(pt)
    return cell.state === 'empty'
  }

  constraintIsFloor(pt: Point) {
    const cell = this.getCell(pt)
    return !cell.isWall && !cell.isDoor
  }

  constraintIsNorthernExposedWall(pt: Point) {
    const cell = this.getCell(pt)
    const cellNorth = this.getCell(pt.north())
    const cellSouth = this.getCell(pt.south())
    return cell.isWall && cellNorth.isOutOfBounds && !cellSouth.isWall
  }

  constraintIsDirtFloor(pt: Point) {
    const cell = this.getCell(pt)
    return cell.terrain.includes('dirtFloor') && !cell.isWall && !cell.isDoor
  }

  constraintIsCorner(pt: Point) {
    const neighbours = pt
      .neighbours4()
      .map(npt => this.getCell(npt))
      .filter(c => c.isWall)
    return neighbours.length === 2
  }
}

export type Constraint =
  | 'cellIsEmpty'
  | 'isFloor'
  | 'isNorthernExposedWall'
  | 'isDirtFloor'
  | 'isCorner'

type CSPObject = {
  entity: EntityKey[]
  constraint: Constraint[]
  box: string[]
}

/* 

e = cell must be empty
O = e + cells will be filled here
box : [
  'eOOOOOe',
  'eOeeeOe',
  'eOOOOOe'
]

*/

function createCSPObject(entity: EntityKey[], constraint: Constraint[], box = ['0']): CSPObject {
  return { entity, constraint: ['cellIsEmpty', ...constraint], box }
}

const cspObjects = {
  grassTuft: createCSPObject(['grassTuft'], ['isDirtFloor']),
  mushrooms: createCSPObject(
    ['redMushrooms', 'purpleMushrooms', 'yellowMushrooms'],
    ['isDirtFloor']
  ),
  webCorner: createCSPObject(['webCorner'], ['isFloor', 'isCorner']),
  sconce: createCSPObject(['sconce'], ['isNorthernExposedWall']),
  smallHolePlatform: createCSPObject(
    ['dirtFloorHole'],
    ['isFloor'],
    ['xxxxxxx', 'x00000x', 'x0xxx0x', 'x00000x', 'xxxxxxx']
  ),
}
