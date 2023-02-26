import { EntityKey, Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle, timer } from '../../../lib/util'
import { Overseer3 } from '../../Overseer3'
import { ConstraintKey, Constraints } from './Constraints'
import { VariableKey, Variables } from './Variables'

export class Solver {
  domain = new Set<Point>()
  timer = 0
  readonly timeout = 5000

  validOrigins = new Map<VariableKey, Set<Point>>()

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

  solveOne(vKeys: VariableKey[], i = 0) {
    if (Date.now() - this.timer >= this.timeout) return false

    if (i >= vKeys.length) {
      // all solved
      return true
    }
    const vKey = vKeys[i]
    const { constraints } = Variables[vKey]
    const cachedDomain = this.validOrigins.get(vKey)
    const domain = cachedDomain ? shuffle([...cachedDomain]) : shuffle([...this.domain])

    let validObject: ProblemObject | undefined
    for (const originPt of domain) {
      // create a relative object mapping
      const object = this.buildObject(vKey, originPt)

      // check constraints for each object point
      if (!this.satisfies(object, constraints)) {
        // * failed, try next point
        this.O3.addObjectGhost(object.map, 'fogRed')
        this.O3.snap('CSP - Invalid')
        continue
      }

      // * success
      // add green ghost
      this.O3.addObjectGhost(object.map, 'fogGreen')
      // add revertible
      const revert = this.O3.addObjectRevertible(object.map)
      this.O3.snap('success')

      // solve recursively
      if (this.solveOne(vKeys, i + 1)) return true
      else {
        // child failed, revert current object and keep trying
        console.warn(`revert ${vKey}`)
        this.O3.revertObject(revert)
      }
    }

    if (i === 0) {
      // * critical fail
      console.error(`critical fail: ${vKey}`)
      return false
    } else return false
  }

  solveAll(vKeys: VariableKey[]) {
    this.timer = Date.now()
    const t = timer('Timer - Preprocess')
    console.log('Start preprocess')
    // preprocess valid origin points
    for (const key of vKeys) {
      if (this.validOrigins.has(key)) continue
      console.log('Process', key)
      const origins = new Set<Point>([...this.domain])

      const { constraints } = Variables[key]

      for (const originPt of this.domain) {
        const object = this.buildObject(key, originPt)
        const problem = {
          region: this.region,
          domain: this.domain,
          object,
          pt: originPt,
        }

        const lastPt = originPt.add(object.width, object.height)
        if (!this.domain.has(lastPt)) {
          origins.delete(originPt)
          continue
        }

        for (const cKey of constraints) {
          if (!Constraints[cKey](problem)) origins.delete(originPt)
        }
      }

      console.log('Done', origins.size, origins)
      this.validOrigins.set(key, origins)

      origins.forEach(pt => this.O3.addGhost(pt, ['horse']))
      this.O3.snap(`Domain: ${key}`)
    }

    console.log('Complete', this.validOrigins)
    t.stop()
    this.solveOne(vKeys)

    if (Date.now() - this.timer >= this.timeout) {
      console.error('CSP - Timeout')
    }
  }

  solveNaive(vKeys: VariableKey[]) {
    for (const vKey of vKeys) {
      const { constraints } = Variables[vKey]
      const domain = shuffle([...this.domain])

      // for each origin point in the domain
      let validObject: ProblemObject | undefined
      for (const originPt of domain) {
        // create a relative object mapping
        const object = this.buildObject(vKey, originPt)

        // check constraints for each object point
        if (this.satisfies(object, constraints)) {
          validObject = object
          break
        }
      }

      if (!validObject) {
        console.error(`Unable to satisfy: ${vKey}`)
        continue // todo switch to break when backtracking added
      }

      // success, place object
      console.log('success:', vKey, validObject.originPt.s)
      for (const [relPt, entityKeys] of validObject.map) {
        entityKeys.forEach(key => this.O3.add(relPt, key))
      }
    }
  }

  // determine if a problem object satisfies a criteria
  private satisfies(object: ProblemObject, constraints: ConstraintKey[]) {
    for (const relPt of object.map.keys()) {
      if (!this.domain.has(relPt)) return false

      for (const key of constraints) {
        const problem = {
          region: this.region,
          domain: this.domain,
          object,
          pt: relPt,
        }
        if (!Constraints[key](problem)) return false
      }
    }
    return true
  }

  // parse a map entry in a variable definition, converting it into a Map of Points -> EntityKeys
  // relative to the origin point
  private buildObject(varKey: VariableKey, originPt: Point) {
    const { keys, map } = Variables[varKey]
    const relMap = new Map<Point, EntityKey[]>()
    let xMax = 0
    let yMax = 0
    map.forEach((row, y) => {
      row.forEach(layer => {
        layer.split('').forEach((keyCell, x) => {
          const relPt = originPt.add(x, y)
          const objectCell = relMap.get(relPt) ?? []

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

          relMap.set(relPt, objectCell)
          if (x > xMax) xMax = x
        })
      })
      if (y > yMax) yMax = y
    })
    const width = xMax - 1
    const height = yMax - 1

    return { map: relMap, originPt, width, height }
  }
}

export type Problem = {
  region: Region
  pt: Point
  domain: Set<Point>
  object: ProblemObject
}

type ProblemObject = {
  map: Map<Point, EntityKey[]>
  originPt: Point
  width: number
  height: number
}

/* 
  CSP History playback

  - Actual objects need to be placed to compute following objects
  - Store invalid placements with negative filter (red alpha overlay?)
  - then disappears for next attempt
  - valid placements with positive filter, then no filter for next attempt

    internal Snapshot-like system ?
    or debug success/fail symbols

    history = [
    
    ]
*/
