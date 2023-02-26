import { EntityKey } from '../../../Core'
import { itemKeys } from '../../../Templates'
import { ConstraintKey } from './Constraints'

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
  randomItem: {
    keys: [[...itemKeys]],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  // * decoration
  cornerCandle: {
    keys: [['candles', 'candlesNE', 'candlesSE']],
    map: [['0']],
    constraints: {
      domain: ['corner', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebNorthWest: {
    keys: ['webNW'],
    map: [['0']],
    constraints: {
      domain: ['cornerNorthWest', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebNorthEast: {
    keys: [['webNE']],
    map: [['0']],
    constraints: {
      domain: ['cornerNorthEast', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebSouthEast: {
    keys: [['webSE']],
    map: [['0']],
    constraints: {
      domain: ['cornerSouthEast', 'walkable'],
      cells: ['empty'],
    },
  },

  cornerWebSouthWest: {
    keys: [['webSW']],
    map: [['0']],
    constraints: {
      domain: ['cornerSouthWest', 'walkable'],
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

  sconce: {
    keys: [['sconce']],
    map: [['0']],
    constraints: {
      domain: ['wall', 'top', 'exposed'],
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

  // * blocking decoration
  bookshelf: {
    keys: ['bookshelf'],
    map: [['0'], [' ']],
    constraints: {
      domain: ['walkable', 'hasWallNorth'],
      cells: ['empty'],
    },
  },

  bookshelfEmpty: {
    keys: ['bookshelfEmpty'],
    map: [['0'], [' ']],
    constraints: {
      domain: ['walkable', 'hasWallNorth'],
      cells: ['empty'],
    },
  },

  bigDesk: {
    keys: ['bigDeskLeft', 'bigDeskMiddle', 'bigDeskRight'],
    map: [['012'], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty', 'walkable'],
    },
  },

  statue: {
    keys: [['statueDragon', 'statueMonster', 'statueWarrior']],
    map: [['   '], [' 0 '], ['   ']],
    constraints: {
      domain: ['walkable'],
      cells: ['empty'],
    },
  },

  statueAltar: {
    keys: [['carpet'], ['statueDragon'], ['wall']],
    map: [
      ['      ', '      '],
      [' 0000 ', ' 1  1 '],
      [' 0  0 ', '  22  '],
      [' 0  0 ', '  22  '],
      [' 0000 ', ' 1  1 '],
      ['      ', '      '],
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

  // * npcs
  goblinPackWeak: {
    keys: ['goblinSword', 'goblinSpear'],
    map: [['01'], ['10']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  goblinPackStrong: {
    keys: ['goblinSword', 'goblinSpear', 'goblinShaman', 'bigGoblin'],
    map: [['01'], ['23']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  skeletonPackWeak: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  skeletonPackStrong: {
    keys: ['skeleton', 'skeletonWarrior'],
    map: [['01'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  spiderPack: {
    keys: ['spider'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  ratPack: {
    keys: ['rat'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  batPack: {
    keys: ['bat'],
    map: [['00'], ['00']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  gelCube: {
    keys: ['gelCube'],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },

  beholder: {
    keys: ['beholder'],
    map: [['0']],
    constraints: {
      domain: ['walkable'],
      cells: ['vacant', 'walkable'],
    },
  },
} satisfies Record<string, Variable>

// const books = {
// space = add keepEmpty placeholder entity
// must be and stay walkable, not empty
//   bookshelf3: {
//     keys: ['bookshelf'],
//     map: [['0'], [' ']],
//     constraints: ['empty', 'walkable'],
//     domain: ['wall'], // used for originPt selection only
//   },
// }
