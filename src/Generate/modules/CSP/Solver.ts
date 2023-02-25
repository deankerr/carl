import { EntityKey, Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { Constraints } from './Constraints'
import { VariableKey, Variables } from './Variables'

export class Solver {
  domain = new Set<Point>()
  full = new Map<Point, boolean>()

  constructor(readonly region: Region, domain: Point[] | Set<Point> | Rect) {
    if (Array.isArray(domain)) domain.forEach(pt => this.domain.add(pt))
    else if (domain instanceof Rect) [...domain.each()].forEach(pt => this.domain.add(pt))
    else [...domain.values()].forEach(pt => this.domain.add(pt))

    this.domain.forEach(pt => this.full.set(pt, false))
    console.log('this.domain:', this.domain)
  }

  solve(varKeys: VariableKey[]) {
    for (const varKey of varKeys) {
      const { constraints } = Variables[varKey]
      const domain = shuffle([...this.domain])

      let satisfies = false
      // for an origin point
      for (const originPt of domain) {
        // create relative pt map of entity grid to test
        const { object, width, height } = this.createObject(varKey, originPt)

        for (const relPt of object.keys()) {
          if (!this.domain.has(relPt)) break

          const domainData = {
            region: this.region,
            pt: relPt,
            domain: this.domain,
            object,
            width,
            height,
          }

          for (const key of constraints) {
            satisfies = Constraints[key](domainData)
            if (!satisfies) break
          }
          if (!satisfies) break
        }
        if (!satisfies) continue

        // * success, place grid
        console.log('success:', originPt.s)
        for (const [relPt, gridKeys] of object) {
          gridKeys.forEach(key => this.region.create(relPt, key))
        }
        break
      }

      if (!satisfies) {
        console.error('CSP failed:', varKey)
        continue
      }
    }
  }

  satisfies(originPt: Point, domain: Set<Point>, varKey: VariableKey) {
    //
  }

  // parse a map entry in a variable definition, converting it into a Map of Points -> EntityKeys
  // relative to the origin point
  createObject(varKey: VariableKey, originPt: Point) {
    const { keys, map } = Variables[varKey]
    const object = new Map<Point, EntityKey[]>()
    let xMax = 0
    let yMax = 0
    map.forEach((row, y) => {
      row.forEach(layer => {
        layer.split('').forEach((keyCell, x) => {
          const relPt = originPt.add(x, y)
          const objectCell = object.get(relPt) ?? []

          if (keyCell !== ' ') {
            const n = parseInt(keyCell)
            if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${keyCell}`)
            objectCell.push(pick(keys[n]))
          }

          object.set(relPt, objectCell)
          if (x > xMax) xMax = x
        })
      })
      if (y > yMax) yMax = y
    })
    const width = xMax - 1
    const height = yMax - 1

    return { object, width, height }
  }
}
