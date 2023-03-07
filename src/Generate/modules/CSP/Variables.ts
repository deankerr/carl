import { EntityKey } from '../../../Core'
import { itemKeys } from '../../../Templates'
import { ConstraintKey } from './Constraints'
import { decoration } from './Variables/decoration'
import { enemy } from './Variables/enemy'
import { furniture } from './Variables/furniture'
import { building } from './Variables/town'

export type Variable = {
  keys: (EntityKey | EntityKey[])[]
  map: string[][]
  constraints: {
    domain: ConstraintKey[]
    cells: ConstraintKey[]
  }
}

export type VariableKey = keyof typeof Variables

export const Variables = {
  ...decoration,
  ...furniture,
  ...enemy,
  ...building,

  randomItem: {
    keys: [[...itemKeys]],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  stairsUp: {
    keys: ['stairsUp'],
    map: [['   '], [' 0 '], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  stairsDown: {
    keys: ['stairsDown'],
    map: [['   '], [' 0 '], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  mushroom: {
    keys: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  smallSludgePond: {
    keys: ['sludge'],
    map: [['    '], [' 00 '], [' 00 '], ['    ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  smallWaterPond: {
    keys: ['water'],
    map: [['    '], [' 00 '], [' 00 '], ['    ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  dirtBoulder: {
    keys: [['dirtBoulder']],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  stoneBoulder: {
    keys: [['stoneBoulder']],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  dirtFloorHoleSquare: {
    keys: [['dirtFloor'], ['dirtFloorHole']],
    map: [['000'], ['010'], ['000']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon'], ['cryptWall'], ['candles']],
    map: [
      ['      ', '      ', '      '],
      [' 0000 ', ' 1  1 ', '      '],
      [' 0  0 ', '  22  ', '   3  '],
      [' 0  0 ', '  22  ', '      '],
      [' 0000 ', ' 1  1 ', '      '],
      ['      ', '      ', '      '],
    ],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  smallDirtPitPlatformItem: {
    keys: [
      ['dirtFloorPit'],
      ['abyss'],
      ['skullBook', 'blueOrb', 'goldSkull', 'goldKey', 'pinkGem'],
    ],
    map: [['       '], [' 00000 '], [' 1  21 '], [' 10001 '], ['       ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },

  smallStonePitPlatformItem: {
    keys: [
      ['stoneFloorPit'],
      ['abyss'],
      ['skullBook', 'blueOrb', 'goldSkull', 'goldKey', 'pinkGem'],
    ],
    map: [['       '], [' 00000 '], [' 1  21 '], [' 10001 '], ['       ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'floor'],
    },
  },
} satisfies Record<string, Variable>
