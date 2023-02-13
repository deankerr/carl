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
}

function createCSPCell(): CSPCell {
  return {
    state: 'empty',
    terrain: 'nothing',
    entities: [],
    isWall: false,
    isDoor: false,
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
      default:
        throw new Error('Unknown constraint')
    }
  }

  constraintIsFloor(pt: Point) {
    const cell = this.getCell(pt)
    return !cell.isWall && !cell.isDoor
  }

  constraintCellIsEmpty(pt: Point) {
    const cell = this.getCell(pt)
    return cell.state === 'empty'
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

export type Constraint = 'cellIsEmpty' | 'isFloor' | 'isDirtFloor' | 'isCorner'

type CSPObject = {
  entity: EntityKey[]
  constraint: Constraint[]
}

function createCSPObject(entity: EntityKey[], constraint: Constraint[]): CSPObject {
  return { entity, constraint: ['cellIsEmpty', ...constraint] }
}

const cspObjects = {
  grassTuft: createCSPObject(['grassTuft'], ['isDirtFloor']),
  mushrooms: createCSPObject(
    ['redMushrooms', 'purpleMushrooms', 'yellowMushrooms'],
    ['isDirtFloor']
  ),
  webCorner: createCSPObject(['webCorner'], ['isFloor', 'isCorner']),
}
