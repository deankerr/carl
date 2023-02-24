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

        if (ref == 'x') {
          relX++
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
console.log('vgrid:', VariableMaps)

export function variableKeyGrid(key: VariableKey, pt: Point) {
  const grid = VariableMaps[key]
  const relGrid = new Map<Point, number[]>()

  for (const [gridPt, keys] of grid) {
    const relPt = pt.add(gridPt)
    relGrid.set(relPt, keys)
  }

  return relGrid
}
