import { EntityKey } from '../../../Core'
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
    map: [['   '], [' 0 '], ['   ']],
    constraints: ['empty', 'walkable'],
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon'], ['dungeonWall']],
    map: [
      ['      ', '      '],
      [' 0000 ', ' 1  1 '],
      [' 0  0 ', '  22  '],
      [' 0  0 ', '  22  '],
      [' 0000 ', ' 1  1 '],
      ['      ', '      '],
    ],
    constraints: ['empty', 'walkable'],
  },
} satisfies Record<string, Variable>
