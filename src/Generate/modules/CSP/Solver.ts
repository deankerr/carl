import { EntityKey, Region } from '../../../Core'
import { point, Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { Overseer3 } from '../../Overseer3'
import { ConstraintKey, Constraints } from './Constraints'
import { Variable, VariableKey, Variables } from './Variables'

export class Solver {
  domain = new Set<Point>()
  timer = 0
  readonly timeout = 2000

  originPtCache = new Map<VariableKey, Set<Point>>()

  constructor(
    readonly region: Region,
    domain: Point[] | Set<Point> | Rect,
    readonly O3: Overseer3
  ) {
    if (Array.isArray(domain)) domain.forEach(pt => this.domain.add(pt))
    else if (domain instanceof Rect) [...domain.each()].forEach(pt => this.domain.add(pt))
    else [...domain.values()].forEach(pt => this.domain.add(pt))

    console.log('Solver - Domain: ', this.domain.size)
  }

  solve(vKeys: VariableKey[]) {
    this.timer = Date.now()
    const originPtCache = new Map<VariableKey, Set<Point>>()
    const problems: Problem[] = []

    for (const vKey of vKeys) {
      const variable = Variables[vKey] as Variable
      const { constraints } = variable
      const object = this.buildObject(vKey)

      const origins = originPtCache.get(vKey) ?? this.buildOriginPtSet(object, constraints.domain)
      originPtCache.set(vKey, origins)

      const problem: Problem = {
        region: this.region,
        domain: this.domain,
        key: vKey,
        constraints: constraints.cells,
        object,
        origins,
      }
      problems.push(problem)
    }

    // debug vis
    for (const [key, pts] of originPtCache) {
      pts.forEach(pt => this.O3.addGhost(pt, ['horse']))
      this.O3.snap(key)
    }

    if (!this.solveNext(problems)) {
      if (Date.now() - this.timer > this.timeout) {
        console.error('CSP Failed - Timeout')
      } else {
        console.error('CSP Failed')
      }
    }
  }

  private solveNext(problems: Problem[], n = 0) {
    if (Date.now() - this.timer > this.timeout) return false
    if (n >= problems.length) return true

    const problem = problems[n]
    const { object } = problem
    const origins = shuffle([...problem.origins])

    for (const originPt of origins) {
      const relPts = [...object.map.keys()].map(zeroPts => zeroPts.add(originPt))

      if (!this.satisfies(problem, relPts)) {
        // fail
        object.map.forEach((keys, zeroPt) =>
          this.O3.addGhost(zeroPt.add(originPt), [...keys, 'fogRed'])
        )
        this.O3.snap('CSP - Invalid')
        continue
      }

      // success
      const revert = this.O3.addObjectRevertible(originPt, object.map)
      relPts.forEach(pt => this.O3.addGhost(pt, ['fogGreen']))
      this.O3.snap('success')

      // next
      if (this.solveNext(problems, n + 1)) return true
      else {
        // next problem failed, revert and try more points
        this.O3.revertObject(revert)
        console.warn('revert:', problem.key)
        this.O3.snap('revert')
      }
    }

    return false
  }

  satisfies(problem: Problem, pts: Point[]) {
    for (const pt of pts) {
      for (const cKey of problem.constraints) {
        if (!Constraints[cKey]({ ...problem, pt })) return false
      }
    }

    return true
  }

  private buildOriginPtSet(object: ProblemObject, constraints: ConstraintKey[]) {
    const origins = new Set<Point>([...this.domain])
    const problem = { region: this.region, domain: this.domain, object }

    for (const pt of this.domain) {
      // last point
      const pt2 = pt.add(object.width - 1, object.height - 1)

      // fast invalid if lastPt is OOB
      if (!this.domain.has(pt2)) {
        origins.delete(pt)
        continue
      }

      // check constraints for origin/last point
      for (const cKey of constraints) {
        if (!Constraints[cKey]({ ...problem, pt })) {
          origins.delete(pt)
          break
        }
      }
    }
    console.log('origins:', origins)
    return origins
  }

  private buildObject(vKey: VariableKey) {
    const { keys, map } = Variables[vKey]
    const zeroMap = new Map<Point, EntityKey[]>()
    let xMax = 0
    let yMax = 0

    map.forEach((row, y) => {
      row.forEach(layer => {
        layer.split('').forEach((keyCell, x) => {
          const zeroPt = point(x, y)
          const objectCell = zeroMap.get(zeroPt) ?? []

          if (keyCell !== ' ') {
            const n = parseInt(keyCell)
            if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${keyCell}`)
            const entityKeys = keys[n]

            if (Array.isArray(entityKeys)) {
              objectCell.push(pick(entityKeys))
            } else {
              objectCell.push(entityKeys)
            }
          }

          zeroMap.set(zeroPt, objectCell)
          if (x > xMax) xMax = x
        })
      })
      if (y > yMax) yMax = y
    })
    const width = xMax + 1
    const height = yMax + 1

    return { map: zeroMap, width, height }
  }
}

export type Problem = {
  region: Region
  domain: Set<Point>
  key: VariableKey
  constraints: ConstraintKey[]
  origins: Set<Point>
  object: ProblemObject
}

export type CProblem = Omit<Problem, 'origins' | 'constraints' | 'key'> & { pt: Point }

export type ProblemObject = {
  map: Map<Point, EntityKey[]>
  width: number
  height: number
}

/* 
  CSP Problem Harness
  - region, domain, 

  problem = {
    region: this.region,
    domainAll: this.domain,
    object: {
      map: [ (0,0)-origin Point,EntityKey[] map ],
      startPt, endPt, - check first for speed
      width, height - might used later for centering
    }
  }
*/

// * initial attempt

// // determine if a problem object satisfies a criteria
// private satisfiesNaive(object: ProblemObject, constraints: ConstraintKey[]) {
//   for (const relPt of object.map.keys()) {
//     if (!this.domain.has(relPt)) return false

//     for (const key of constraints) {
//       const problem = {
//         region: this.region,
//         domain: this.domain,
//         object,
//         pt: relPt,
//       }
//       if (!Constraints[key](problem)) return false
//     }
//   }
//   return true
// }

//  solveNaive(vKeys: VariableKey[]) {
//   for (const vKey of vKeys) {
//     const { constraints } = Variables[vKey]
//     const domain = shuffle([...this.domain])

//     // for each origin point in the domain
//     let validObject: ProblemObject | undefined
//     for (const originPt of domain) {
//       // create a relative object mapping
//       const object = this.buildObjectNaive(vKey, originPt)

//       // check constraints for each object point
//       if (this.satisfiesNaive(object, constraints)) {
//         validObject = object
//         break
//       }
//     }

//     if (!validObject) {
//       console.error(`Unable to satisfy: ${vKey}`)
//       continue // todo switch to break when backtracking added
//     }

//     // success, place object
//     console.log('success:', vKey, validObject.originPt.s)
//     for (const [relPt, entityKeys] of validObject.map) {
//       entityKeys.forEach(key => this.O3.add(relPt, key))
//     }
//   }
// }

// // parse a map entry in a variable definition, converting it into a Map of Points -> EntityKeys
// // relative to the origin point
// private buildObjectNaive(varKey: VariableKey, originPt: Point) {
//   const { keys, map } = Variables[varKey]
//   const relMap = new Map<Point, EntityKey[]>()
//   let xMax = 0
//   let yMax = 0
//   map.forEach((row, y) => {
//     row.forEach(layer => {
//       layer.split('').forEach((keyCell, x) => {
//         const relPt = originPt.add(x, y)
//         const objectCell = relMap.get(relPt) ?? []

//         if (keyCell !== ' ') {
//           const n = parseInt(keyCell)
//           if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${keyCell}`)
//           const entityKeys = keys[n]
//           if (Array.isArray(entityKeys)) {
//             objectCell.push(pick(entityKeys))
//           } else {
//             objectCell.push(entityKeys)
//           }
//         }

//         relMap.set(relPt, objectCell)
//         if (x > xMax) xMax = x
//       })
//     })
//     if (y > yMax) yMax = y
//   })
//   const width = xMax + 1
//   const height = yMax + 1

//   return { map: relMap, originPt, width, height }
// }
