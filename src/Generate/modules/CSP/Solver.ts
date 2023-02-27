import { EntityKey, Region } from '../../../Core'
import { point, Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { logTimer, pick, shuffle } from '../../../lib/util'
import { Overseer3 } from '../../Overseer3'
import { ConstraintKey, Constraints } from './Constraints'
import { Variable, VariableKey, Variables } from './Variables'

export class Solver {
  domain = new Set<Point>()
  timer = 0
  readonly maxTime = 1000

  originPtCache = new Map<VariableKey, Point[]>()

  debugShowOrigins = true

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

  solve(keys: VariableKey[]) {
    this.timer = Date.now()
    const t = logTimer('solve')

    const problems = this.buildProblems(keys)

    if (!this.solveNext(problems)) {
      if (this.timeout()) {
        console.error('CSP Failed - Timeout')
        console.error(keys)
      } else {
        console.error('CSP Failed')
        console.error(keys)
      }
    }

    t.stop()
  }

  solveOptional(keys: VariableKey[]) {
    this.timer = Date.now()

    const problems = this.buildProblems(keys)

    for (const problem of shuffle(problems)) {
      this.solveNext([problem])
    }

    if (this.timeout()) {
      console.error('CSP Failed - Timeout')
      console.error(keys)
    }
  }

  fill(keys: VariableKey[], percent = 1) {
    if (percent < 0 || percent > 1) throw new Error('percent must be between 0 to 1')
    this.timer = Date.now()

    const problems = this.buildProblems(keys)

    for (const problem of shuffle(problems)) {
      const possible = this.findOriginPts(problem).length
      const target = possible * percent
      let count = 0

      while (count < target && count < possible && !this.timeout()) {
        if (this.solveNext([problem])) count++
      }
    }
  }

  private solveNext(problems: Problem[], n = 0) {
    if (this.timeout()) return false
    if (n >= problems.length) return true

    const problem = problems[n]
    const origins = this.findOriginPts(problem)

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
      this.O3.snap(`Success - ${problem.key}`)

      // next
      if (this.solveNext(problems, n + 1)) return true
      else {
        // next problem failed, revert and try more points
        this.O3.revertObject(revert)
        console.warn('revert:', problem.key)
        this.O3.snap('Revert - ' + problem.key)
      }
    }

    console.error('Unable to place', problem.key)
    return false
  }

  private satisfies(problem: Problem, relMap: Map<Point, EntityKey[]>) {
    for (const [pt, keys] of relMap) {
      const constraints = keys.length > 0 ? problem.constraints.cells : problem.constraints.space
      for (const key of constraints) {
        if (!Constraints[key](problem, pt)) return false
      }
    }
    return true
  }

  private buildProblems(keys: VariableKey[]) {
    const problems: Problem[] = []

    for (const key of keys) {
      const variable = Variables[key] as Variable

      const problem: Problem = {
        region: this.region,
        domain: this.domain,
        key,
        constraints: { ...variable.constraints, space: ['floor', 'walkable'] },
        object: this.buildObjectMap(key),
      }
      problems.push(problem)
    }

    return problems
  }

  private findOriginPts(problem: Problem) {
    const cached = this.originPtCache.get(problem.key)
    if (cached) return shuffle(cached)

    const timer = logTimer('build origin cache - ' + problem.key)
    const originSet = new Set<Point>([...this.domain])

    for (const pt of this.domain) {
      // last point
      const pt2 = pt.add(problem.object.width - 1, problem.object.height - 1)

      // fast invalid if lastPt is out of domain bounds
      if (!this.domain.has(pt2)) {
        originSet.delete(pt)
        continue
      }

      // check constraints for origin/last point
      for (const cKey of problem.constraints.domain) {
        if (!Constraints[cKey](problem, pt)) {
          originSet.delete(pt)
          break
        }
      }
    }

    // debug - display origin pts in visualizer
    if (this.debugShowOrigins) {
      for (const pt of originSet) {
        this.O3.addGhost(pt, ['horse'])
      }
      this.O3.snap('Origins - ' + problem.key)
    }

    const origins = [...originSet]
    this.originPtCache.set(problem.key, origins)

    timer.stop()
    return shuffle(origins)
  }

  private buildObjectMap(vKey: VariableKey) {
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

  private localizeObjectMap(pt: Point, map: Map<Point, EntityKey[]>) {
    const localMap = new Map<Point, EntityKey[]>()
    for (const [zeroPt, keys] of map) {
      localMap.set(zeroPt.add(pt), keys)
    }
    return localMap
  }

  private timeout() {
    if (Date.now() - this.timer > this.maxTime) console.error('timeout')
    return Date.now() - this.timer > this.maxTime
  }
}

export type Problem = {
  region: Region
  domain: Set<Point>
  key: VariableKey
  constraints: Record<'domain' | 'cells' | 'space', ConstraintKey[]>
  object: ProblemObject
}

export type ProblemObject = {
  map: Map<Point, EntityKey[]>
  width: number
  height: number
}
