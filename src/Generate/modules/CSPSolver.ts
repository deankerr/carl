import { Entity, EntityKey, Region } from '../../Core'
import { CSPConstraints } from './CSPConstraints'
import { CSPVar } from './CSPVariables'
import { pick, shuffle } from '../../lib/util'
import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'

export class CSPSolver {
  domain: Point[] = []
  constructor(readonly region: Region) {}
  initializeRect(rect: Rect) {
    rect.traverse(pt => this.domain.push(pt))
  }

  solve<K extends keyof typeof CSPVar>(variables: typeof CSPVar[K][]) {
    if (this.domain.length === 0) throw new Error('CSP: Domain is empty')
    for (const variable of variables) {
      const { constraints, key, object } = variable
      //console.log('variable:', key)
      const domain = shuffle(this.domain)
      let satisfies = false

      for (const pt of domain) {
        let isRoot = true
        // TODO DRY
        //console.log('assess pt', pt.s)
        if ('all' in constraints) {
          for (const c of constraints.all) {
            //console.log('(all) try', c)
            satisfies = CSPConstraints[c](this.region, pt, this.domain)
            //console.log('satisfies:', satisfies)
            if (!satisfies) break
          }
          if (!satisfies) continue
        }

        if ('root' in constraints && isRoot) {
          for (const c of constraints.root) {
            //console.log('(root) try', c)
            satisfies = CSPConstraints[c](this.region, pt, this.domain)
            isRoot = false
            //console.log('satisfies:', satisfies)
            if (!satisfies) break
          }
          if (!satisfies) continue
        }

        if ('other' in constraints && !isRoot) {
          for (const c of constraints.other) {
            //console.log('(other) try', c)
            satisfies = CSPConstraints[c](this.region, pt, this.domain)
            //console.log('satisfies:', satisfies)
            if (!satisfies) break
          }
          if (!satisfies) continue
        }

        //console.log('SUCCESS!')

        // place object
        if (Array.isArray(object)) {
          //console.log('place as array')
          object.forEach((k, i) => {
            if (k !== 'x') {
              const n = parseInt(k)
              const eKey = key[n]
              const eeeKey = Array.isArray(eKey) ? pick(eKey) : eKey
              const relPt = pt.east(i)
              this.region.create(relPt, eeeKey as EntityKey)
            }
          })
          break
        } else if (0 in object) {
          // todo type any[]
          //console.log('place as object')

          let relY = 0
          for (const layers of Object.values(object)) {
            if (Array.isArray(layers)) {
              for (const layer of layers) {
                //console.log('layer:', layer)
                let relX = 0
                for (const x of layer) {
                  if (x !== 'x') {
                    const keyRef = parseInt(x)
                    const eKey = key[keyRef] as EntityKey
                    const relPt = pt.add(relX, relY)
                    //console.log('relPt', relPt.s)
                    this.region.create(relPt, eKey)
                  }
                  relX++
                }
              }
            }
            relY++
          }
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
}

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

// type CSPObject = {
//   entity: EntityKey[]
//   constraint: Constraint[]
//   grid: string[]
// }

// function createCSPObject(entity: EntityKey[], constraint: Constraint[], grid = ['A']): CSPObject {
//   return { entity, constraint: ['cellIsEmpty', ...constraint], grid }
// }
