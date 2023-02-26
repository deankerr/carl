import { EntityKey, Region } from '../../../Core'
import { point, Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { Overseer3 } from '../../Overseer3'
import { ConstraintKey, Constraints } from './Constraints'
import { Variable, VariableKey, Variables } from './Variables'

const spaceConstraints: ConstraintKey[] = ['floor', 'walkable']

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

    // debug - display origin pts in visualizer
    // for (const [key, pts] of originPtCache) {
    //   pts.forEach(pt => this.O3.addGhost(pt, ['horse']))
    //   this.O3.snap(key)
    // }

    if (!this.solveNext(problems)) {
      if (Date.now() - this.timer > this.timeout) {
        console.error('CSP Failed - Timeout')
        console.error(vKeys)
      } else {
        console.error('CSP Failed')
        console.error(vKeys)
      }
    }
  }

  private solveNext(problems: Problem[], n = 0) {
    if (Date.now() - this.timer > this.timeout) return false
    if (n >= problems.length) return true

    const problem = problems[n]
    const origins = shuffle([...problem.origins])

    for (const originPt of origins) {
      const relMap = this.localizeObjectMap(originPt, problem.object.map)
      const relPts = [...relMap.keys()]

      if (!this.satisfies(problem, relMap)) {
        // failure
        this.O3.addObjectGhost(relMap, 'fogRed')
        this.O3.snap('CSP - Invalid')
        continue
      }

      // success
      const revert = this.O3.addObjectRevertible(relMap)
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

  satisfies(problem: Problem, relMap: Map<Point, EntityKey[]>) {
    for (const [pt, keys] of relMap) {
      const constraints = keys.length > 0 ? problem.constraints : spaceConstraints
      for (const cKey of constraints) {
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

  localizeObjectMap(pt: Point, map: Map<Point, EntityKey[]>) {
    const localMap = new Map<Point, EntityKey[]>()
    for (const [zeroPt, keys] of map) {
      localMap.set(zeroPt.add(pt), keys)
    }
    return localMap
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
