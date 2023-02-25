import { EntityKey, Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { ConstraintKey, Constraints } from './Constraints'
import { VariableKey, Variables } from './Variables'

export class Solver {
  domain = new Set<Point>()
  full = new Map<Point, boolean>()

  constructor(readonly region: Region, domain: Point[] | Set<Point> | Rect) {
    if (Array.isArray(domain)) domain.forEach(pt => this.domain.add(pt))
    else if (domain instanceof Rect) [...domain.each()].forEach(pt => this.domain.add(pt))
    else [...domain.values()].forEach(pt => this.domain.add(pt))

    this.domain.forEach(pt => this.full.set(pt, false))
  }

  solve(vKeys: VariableKey[]) {
    for (const vKey of vKeys) {
      const { constraints } = Variables[vKey]
      const domain = shuffle([...this.domain])

      // for each origin point in the domain
      let validObject: ProblemObject | undefined
      for (const originPt of domain) {
        // create a relative object mapping
        const object = this.createObject(vKey, originPt)

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
        entityKeys.forEach(key => this.region.create(relPt, key))
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
  private createObject(varKey: VariableKey, originPt: Point) {
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
            objectCell.push(pick(keys[n]))
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
*/
