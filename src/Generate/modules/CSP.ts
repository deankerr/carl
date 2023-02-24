import { EntityKey, Region } from '../../Core'
import { point, Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { pick, shuffle } from '../../lib/util'

export class CSPSolve {
  domain = new Set<Point>()
  full = new Map<Point, boolean>()

  constructor(readonly region: Region, domain: Point[] | Set<Point> | Rect) {
    if (Array.isArray(domain)) domain.forEach(pt => this.domain.add(pt))
    else if (domain instanceof Rect) [...domain.each()].forEach(pt => this.domain.add(pt))
    else [...domain.values()].forEach(pt => this.domain.add(pt))

    this.domain.forEach(pt => this.full.set(pt, false))
    console.log('this.domain:', this.domain)
  }

  solve(varKeys: VarKey[]) {
    for (const varKey of varKeys) {
      const { keys, map, constraints } = vars[varKey]
      const domain = shuffle([...this.domain])

      // * build grid
      const grid = new Map<Point, EntityKey[]>()
      let relY = 0
      for (const y of map) {
        for (const xLayer of y) {
          let relX = 0
          for (const ref of xLayer) {
            const gridPt = point(relX, relY)
            const ptList = grid.get(gridPt) ?? []

            if (ref == 'x') {
              relX++
              continue
            }

            const n = parseInt(ref)
            if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${n}`)

            grid.set(gridPt, [...ptList, pick(keys[n])])
            relX++
          }
        }
        relY++
      }

      console.log('grid:', grid)

      // *---

      let satisfies = false
      // for an origin point
      for (const originPt of domain) {
        // test all points in the entity grid
        for (const gridPt of grid.keys()) {
          const relPt = originPt.add(gridPt)
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
        for (const [gridPt, gridKeys] of grid) {
          const relPt = originPt.add(gridPt)
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
}

const vars = {
  mushrooms: {
    keys: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    map: [['0']],
    constraints: ['empty', 'walkable'],
  },

  statue: {
    keys: [['statueDragon', 'statueMonster', 'statueWarrior']],
    map: [['0']],
    constraints: ['empty', 'walkable'],
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon', 'statueMonster', 'statueWarrior'], ['dungeonWall']],
    map: [
      ['0000', '1xx1'],
      ['0xx0', 'x22x'],
      ['0000', '1xx1'],
    ],
    constraints: ['empty', 'walkable'],
  },

  tAltar: {
    keys: [['carpet'], ['statueDragon']],
    map: [['000', 'x1x']],
    constraints: ['empty'],
  },
} satisfies Record<string, VAR>

type VAR = {
  keys: EntityKey[][]
  map: string[][]
  constraints: ConstraintKey[]
}

type VarKey = keyof typeof vars

const Constraints = {
  empty: function (d: DomainData) {
    return d.region.at(d.pt).length <= 1
  },
  walkable: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length === 0
  },
  isBlocked: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.blocksMovement).length > 0
  },
  isWall: function (d: DomainData) {
    return d.region.at(d.pt).filter(e => e.wall).length > 0
  },
} satisfies Record<string, Constraint>

type Constraint = (d: DomainData) => boolean

type ConstraintKey = keyof typeof Constraints

type DomainData = {
  region: Region
  pt: Point
  domain: Set<Point>
}
