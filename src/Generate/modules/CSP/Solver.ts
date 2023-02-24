import { Region } from '../../../Core'
import { Point } from '../../../lib/Shape/Point'
import { Rect } from '../../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../../lib/util'
import { Constraints } from './Constraints'
import { VariableKey, variableKeyGrid, Variables } from './Variables'

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
      const { keys, constraints } = Variables[varKey]
      const domain = shuffle([...this.domain])

      let satisfies = false
      // for an origin point
      for (const originPt of domain) {
        // test all points in the entity grid
        const grid = variableKeyGrid(varKey, originPt)
        console.log('grid:', grid)
        for (const relPt of grid.keys()) {
          if (!this.domain.has(relPt)) break

          const domainData = { region: this.region, pt: relPt, domain: this.domain }

          for (const constraint of constraints) {
            satisfies = Constraints[constraint](domainData)
            if (!satisfies) break
          }
          if (!satisfies) break
        }

        if (!satisfies) continue

        console.log('success:', originPt.s)
        for (const [relPt, gridKeys] of grid) {
          gridKeys.forEach(key => this.region.create(relPt, pick(keys[key])))
        }
        break
      }

      if (!satisfies) {
        console.error('CSP failed:', varKey)
        continue
      }
    }
  }
}
