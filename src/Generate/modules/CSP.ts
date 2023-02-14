import { Entity, EntityKey, Region } from '../../Core'
import { pick, shuffle } from '../../lib/util'
import { Point } from '../../Model/Point'
import { Rect } from '../../Model/Rectangle'

export class Solver {
  domain: Point[] = []
  constructor(readonly region: Region) {}
  initializeRect(rect: Rect) {
    rect.traverse(pt => this.domain.push(pt))
  }

  solve<K extends keyof typeof CSPVar>(variable: typeof CSPVar[K]) {
    if (this.domain.length === 0) throw new Error('CSP: Domain is empty')
    console.log('variable:', variable)
    const { constraints, key, object } = variable
    const domain = shuffle(this.domain)
    let satisfies = true

    for (const pt of domain) {
      console.log('for pt')
      if ('all' in constraints) {
        for (const c of constraints.all) {
          console.log('try', c)
          satisfies = CSPConstraints[c](this.region, pt)
          console.log('satisfies:', satisfies)
          if (!satisfies) break
        }
      }
      if (!satisfies) continue

      console.log('SUCCESS!')

      // place object
      if (Array.isArray(object)) {
        object.forEach((k, i) => {
          if (k !== 'x') {
            const n = parseInt(k)
            const eKey = key[n]
            const eeeKey = Array.isArray(eKey) ? pick(eKey) : eKey
            const relPt = pt.east(i)
            this.region.create(relPt, eeeKey)
          }
        })
        break
      } else {
        console.error("CSP: I don't know how to place that")
      }
    }

    if (!satisfies) {
      console.error('CSP Failed to solve')
    }
  }
}

export const CSPVar = {
  sconce: {
    constraints: {
      root: ['isExposedWall'],
      other: ['isNotWall'],
    },
    key: ['sconce', 'sconesLower'],
    object: {
      0: ['0'],
      1: ['1'],
    },
  },
  mushrooms: {
    constraints: {
      all: ['isDirtFloor'],
    },
    key: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    object: ['0'],
  },
  cornerWebs: {
    constraints: {
      all: ['isFloor', 'isCorner'],
    },
    key: ['webCorner'],
    object: ['0'],
  },
  smallPitPlatform: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['dirtFloorHole'],
    object: {
      0: ['xxxxxxx'],
      1: ['x00000x'],
      2: ['x0xxx0x'],
      3: ['x00000x'],
      4: ['xxxxxxx'],
    },
  },
  statueAltar: {
    constraints: {
      all: ['isFloor', 'isCenterAligned'],
    },
    key: ['carpet', 'statueDragon', 'wall'],
    object: {
      0: ['xxxxxx', '      '],
      1: ['x0000x', ' 1  1 '],
      2: ['x0000x', '  22  '],
      3: ['x0000x', '  22  '],
      4: ['x0000x', ' 1  1 '],
      5: ['xxxxxx', '      '],
    },
  },
} as const

const CSPConstraints = {
  cellIsEmpty: function (region: Region, pt: Point) {
    return region.at(pt).length <= 1 // ???
  },
  isWall: function (region: Region, pt: Point) {
    return 'wall' in region.terrainAt(pt)
  },
  isNotWall: function (region: Region, pt: Point) {
    return this.isWall(region, pt)
  },
  isFloor: function (region: Region, pt: Point) {
    return region.terrainAt(pt).floor === true
  },
  isDirtFloor: function (region: Region, pt: Point) {
    return region.terrainAt(pt).label.includes('dirtFloor')
  },
  isExposedWall: function (region: Region, pt: Point) {
    const t = region.terrainAt(pt)
    return 'wall' in t && 'isHorizontal' in t && !('wall' in region.terrainAt(pt.south()))
  },
  isCorner: function (region: Region, pt: Point) {
    const neighbours = pt
      .neighbours4()
      .map(npt => region.terrainAt(npt))
      .filter(c => c.wall)
    console.log('neighbours:', neighbours)
    return neighbours.length === 2 // doorways could trigger this
  },
  isCenterAligned: function (region: Region, pt: Point) {
    return true // todo
  },
}

// states -
//  empty: cell is free and can receive object,
//  margin: cell is free and should stay free (ie.doorway)
//  full: cell has received object

// type CSPCell = {
//   state: 'empty' | 'margin' | 'full'
//   terrain: EntityKey
//   entities: EntityKey[]
//   isWall: boolean
//   isDoor: boolean
//   isOutOfBounds: boolean
// }

// function createCSPCell(): CSPCell {
//   return {
//     state: 'empty',
//     terrain: 'nothing',
//     entities: [],
//     isWall: false,
//     isDoor: false,
//     isOutOfBounds: false,
//   }
// }

// export class ConstraintSatisfactionProblemSolver {
//   cellMap = new Map<Point, CSPCell>()
//   constructor(readonly region: Region) {}

//   createCell(pt: Point) {
//     const cell = createCSPCell()
//     this.cellMap.set(pt, cell)
//     return cell
//   }

//   getCell(pt: Point) {
//     const cell = this.cellMap.get(pt)
//     if (!cell) {
//       const oobCell = createCSPCell()
//       oobCell.state = 'full'
//       oobCell.isOutOfBounds = true
//       return oobCell
//     }
//     return cell
//   }

//   each(callback: (pt: Point, cell: CSPCell) => unknown) {
//     for (const [pt, cell] of this.cellMap) {
//       callback(pt, cell)
//     }
//   }

//   initializeRect(rect: Rect) {
//     rect.traverse(pt => {
//       const cell = this.createCell(pt)
//       const [terrainHere, ...entitiesHere] = this.region.at(pt)
//       cell.terrain = terrainHere.label as EntityKey
//       cell.isWall = terrainHere.wall === true
//       cell.isDoor = entitiesHere.filter(e => e.door).length > 0
//     })
//   }

//   debugLogPointMap() {
//     console.groupCollapsed('Cell Map')
//     for (const [pt, cell] of this.cellMap) {
//       console.log(pt, cell)
//     }
//     console.groupEnd()
//   }

//   solve(key: keyof typeof cspObjects, amount = 1) {
//     const domain = shuffle([...this.cellMap.keys()])
//     const { entity, constraint, grid } = cspObjects[key]
//     let successes = 0

//     for (const pt of domain) {
//       // assess constraints for each char in box
//       let satisfies = true
//       this.forCellGrid(pt, grid, relPt => {
//         for (const c of constraint) {
//           satisfies = this.assessConstraint(c, relPt)
//           if (!satisfies) return false
//         }
//         return true
//       })

//       if (!satisfies) {
//         continue
//       }

//       // success
//       this.forCellGrid(pt, grid, (_relPt, cell, gridValue) => {
//         if (gridValue !== 'x') {
//           cell.state = 'full'
//           if (gridValue === 'A') {
//             cell.entities.push(pick(entity))
//           } else {
//             const i = parseInt(gridValue)
//             if (Number.isNaN(i) || entity[i] === undefined) {
//               throw new Error(`CSP: Invalid grid value ${i} / ${entity[i]}`)
//             }
//             cell.entities.push(entity[i])
//           }
//         }
//       })

//       successes++
//       if (successes >= amount) break
//     }

//     if (successes === 0) console.error('CSP Failed to solve:', key)
//   }

//   forCellGrid(
//     pt: Point,
//     grid: string[],
//     callback: (pt: Point, cell: CSPCell, gridValue: string) => unknown
//   ) {
//     for (let yi = 0; yi < grid.length; yi++) {
//       for (let xi = 0; xi < grid[yi].length; xi++) {
//         const relPt = pt.add(xi, yi)
//         if (callback(relPt, this.getCell(relPt), grid[yi][xi]) === false) return
//       }
//     }
//   }

//   assessConstraint(constraint: Constraint, pt: Point) {
//     switch (constraint) {
//       case 'isFloor':
//         return this.constraintIsFloor(pt)
//       case 'isDirtFloor':
//         return this.constraintIsDirtFloor(pt)
//       case 'cellIsEmpty':
//         return this.constraintCellIsEmpty(pt)
//       case 'isCorner':
//         return this.constraintIsCorner(pt)
//       case 'isNorthernExposedWall':
//         return this.constraintIsNorthernExposedWall(pt)
//       default:
//         throw new Error('Unknown constraint')
//     }
//   }

//   constraintCellIsEmpty(pt: Point) {
//     const cell = this.getCell(pt)
//     return cell.state === 'empty'
//   }

//   constraintIsFloor(pt: Point) {
//     const cell = this.getCell(pt)
//     return !cell.isWall && !cell.isDoor
//   }

//   constraintIsNorthernExposedWall(pt: Point) {
//     const cell = this.getCell(pt)
//     const cellNorth = this.getCell(pt.north())
//     const cellSouth = this.getCell(pt.south())
//     return cell.isWall && cellNorth.isOutOfBounds && !cellSouth.isWall
//   }

//   constraintIsDirtFloor(pt: Point) {
//     const cell = this.getCell(pt)
//     return cell.terrain.includes('dirtFloor') && !cell.isWall && !cell.isDoor
//   }

//   constraintIsCorner(pt: Point) {
//     const neighbours = pt
//       .neighbours4()
//       .map(npt => this.getCell(npt))
//       .filter(c => c.isWall)
//     return neighbours.length === 2
//   }
// }

// export type Constraint =
//   | 'cellIsEmpty'
//   | 'isFloor'
//   | 'isNorthernExposedWall'
//   | 'isDirtFloor'
//   | 'isCorner'

// type CSPObject = {
//   entity: EntityKey[]
//   constraint: Constraint[]
//   grid: string[]
// }

// /*
// grid:
//   'xxxxx',
//   'x0A0x',
//   'xxxxx

// x = apply constraints + mark as full but place nothing
// A = any - pick random
// 0-9 = place entity[n]
// */

// function createCSPObject(entity: EntityKey[], constraint: Constraint[], grid = ['A']): CSPObject {
//   return { entity, constraint: ['cellIsEmpty', ...constraint], grid }
// }

// export type CSPObjectKey = keyof typeof cspObjects
// export const cspObjects = {
//   grassTuft: createCSPObject(['grassTuft'], ['isDirtFloor']),
//   mushrooms: createCSPObject(
//     ['redMushrooms', 'purpleMushrooms', 'yellowMushrooms'],
//     ['isDirtFloor']
//   ),
//   webCorner: createCSPObject(['webCorner'], ['isFloor', 'isCorner']),
//   // sconce: createCSPObject(['sconce', 'sconceLower'], ['isNorthernExposedWall'], ['0', '1']),
//   sconce: createCSPObject(['sconce'], ['isNorthernExposedWall'], ['0']),
//   smallPitPlatform: createCSPObject(
//     ['dirtFloorHole'],
//     ['isFloor'],
//     ['xxxxxxx', 'x00000x', 'x0xxx0x', 'x00000x', 'xxxxxxx']
//   ),
//   cornerCandles: createCSPObject(['candles', 'candlesNE', 'candlesSE'], ['isFloor', 'isCorner']),
//   smallWaterPool: createCSPObject(
//     ['water'],
//     ['isFloor'],
//     ['xxxxx', 'x000x', 'x000x', 'x000x', 'xxxxx']
//   ),
//   smallSlimePool: createCSPObject(['slime'], ['isFloor'], ['xxxx', 'x00x', 'x00x', 'xxxx']),
//   smallOilPool: createCSPObject(['oil'], ['isFloor'], ['xxxx', 'x00x', 'x00x', 'xxxx']),
//   smallAcidPool: createCSPObject(
//     ['acid'],
//     ['isFloor'],
//     ['xxxxx', 'x000x', 'x000x', 'x000x', 'xxxxx']
//   ),
//   smallBloodPool: createCSPObject(['blood'], ['isFloor'], ['xxxx', 'x00x', 'x00x', 'xxxx']),
//   smallSludgePool: createCSPObject(['sludge'], ['isFloor'], ['xxxx', 'x00x', 'x00x', 'xxxx']),
//   smallAcidPoolPlatform: createCSPObject(
//     ['acid'],
//     ['isFloor'],
//     ['xxxxx', 'x000x', 'x0x0x', 'x000x', 'xxxxx']
//   ),
//   smallCarpet: createCSPObject(
//     ['carpet', 'carpetEmblem1', 'carpetEmblem2'],
//     ['isFloor'],
//     ['20002', '00100', '20002']
//   ),
//   smallCarpetTall: createCSPObject(
//     ['carpet', 'carpetEmblem1', 'carpetEmblem2'],
//     ['isFloor'],
//     ['202', '000', '010', '000', '202']
//   ),
//   statueCarpetAltar: createCSPObject(
//     ['statueDragon', 'carpet', 'cavernWall'],
//     ['isFloor'],
//     ['0110', '1221', '1221', '0110']
//   ),
// }
