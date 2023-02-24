import { EntityKey } from '../../../Core'
import { point, Point } from '../../../lib/Shape/Point'
import { ConstraintKey } from './Constraints'

type Variable = {
  keys: EntityKey[][]
  map: string[][]
  constraints: ConstraintKey[]
}

export type VariableKey = keyof typeof Variables

export const Variables = {
  sconce: {
    keys: [['sconce']],
    map: [['0']],
    constraints: ['empty', 'wall', 'top', 'exposed'],
  },

  mushrooms: {
    keys: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    map: [['0']],
    constraints: ['empty', 'walkable'],
  },

  statue: {
    keys: [['statueDragon', 'statueMonster', 'statueWarrior']],
    map: [['xxx'], ['x0x'], ['xxx']],
    constraints: ['empty', 'walkable'],
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon', 'statueMonster', 'statueWarrior'], ['dungeonWall']],
    map: [
      ['xxxxxx', 'xxxxxx'],
      ['x0000x', 'x1xx1x'],
      ['x0xx0x', 'xx22xx'],
      ['x0xx0x', 'xx22xx'],
      ['x0000x', 'x1xx1x'],
      ['xxxxxx', 'xxxxxx'],
    ],
    constraints: ['empty', 'walkable'],
  },
} satisfies Record<string, Variable>

const VariableMaps = Object.entries(Variables).reduce((acc, curr) => {
  const vKey = curr[0]
  const { map } = curr[1]

  const grid = new Map<Point, number[]>()

  let relY = 0
  for (const y of map) {
    for (const xLayer of y) {
      let relX = 0
      for (const ref of xLayer) {
        const gridPt = point(relX, relY)
        const ptList = grid.get(gridPt) ?? []

        if (ref === 'x') {
          relX++
          grid.set(gridPt, ptList)
          continue
        }

        const n = parseInt(ref)
        if (isNaN(n)) throw new Error(`CSP keyRef is NaN: ${n}`)

        grid.set(gridPt, [...ptList, n])
        relX++
      }
    }
    relY++
  }

  return { ...acc, [vKey]: grid }
}, {} as Record<VariableKey, Map<Point, number[]>>)

export function variableKeyGrid(key: VariableKey, pt: Point) {
  const grid = VariableMaps[key]
  const relGrid = new Map<Point, number[]>()

  for (const [gridPt, keys] of grid) {
    const relPt = pt.add(gridPt)
    relGrid.set(relPt, keys)
  }

  return relGrid
}
