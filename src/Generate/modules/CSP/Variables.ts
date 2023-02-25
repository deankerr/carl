import { EntityKey } from '../../../Core'
import { ConstraintKey } from './Constraints'

type Variable = {
  keys: EntityKey[][]
  map: string[][]
  constraints: ConstraintKey[]
}

export type VariableKey = keyof typeof Variables

export const Variables = {
  cornerCandle: {
    keys: [['candles', 'candlesNE', 'candlesSE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'corner'],
  },

  cornerWebNorthWest: {
    keys: [['webNW']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerNorthWest'],
  },

  cornerWebNorthEast: {
    keys: [['webNE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerNorthEast'],
  },

  cornerWebSouthEast: {
    keys: [['webSE']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerSouthEast'],
  },

  cornerWebSouthWest: {
    keys: [['webSW']],
    map: [['0']],
    constraints: ['empty', 'walkable', 'cornerSouthWest'],
  },

  mushrooms: {
    keys: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    map: [['0']],
    constraints: ['empty', 'walkable'],
  },

  sconce: {
    keys: [['sconce']],
    map: [['0']],
    constraints: ['empty', 'wall', 'top', 'exposed'],
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
