export const CSPVar = {
  // hostile
  goblinPack: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['goblinSword', 'goblinSpear', 'goblinShaman', 'bigGoblin'],
    object: {
      0: ['0101'],
      1: ['1230'],
      2: ['0101'],
    },
  },

  skeletonPack: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['skeleton', 'skeletonWarrior', 'skeletonShaman', 'skeletonKing'],
    object: {
      0: ['0101'],
      1: ['1230'],
      2: ['0101'],
    },
  },

  beholder: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['beholder'],
    object: ['0'],
  },

  gelCube: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['gelCube'],
    object: ['0'],
  },

  spiderPack: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['spider'],
    object: {
      0: ['x0x'],
      1: ['0x0'],
      2: ['x0x'],
    },
  },

  // decoration

  sconce: {
    constraints: {
      root: ['isExposedWall', 'isNorthernWall'],
      other: ['isNotWall', 'isEmpty'],
    },
    key: ['sconce', 'sconceLower'],
    object: {
      0: ['0'],
      1: ['1'],
    },
  },
  mushrooms: {
    constraints: {
      all: ['isDirtFloor'],
    },
    key: [['redMushrooms', 'purpleMushrooms', 'yellowMushrooms']],
    object: ['0'],
  },
  cornerWebs: {
    constraints: {
      all: ['isEmpty', 'isFloor', 'isCorner'],
    },
    key: ['webNE'],
    object: ['0'],
  },
  cornerCandles: {
    constraints: {
      all: ['isEmpty', 'isFloor', 'isCorner'],
    },
    key: [['candles', 'candlesNE', 'candlesSE']],
    object: ['0'],
  },
  smallPitPlatform: {
    constraints: {
      all: ['isFloor'],
    },
    key: ['dirtFloorHole'],
    object: {
      0: ['xxxxxxx'],
      1: ['x00000x'],
      2: ['x0xxx0x'],
      3: ['x00000x'],
      4: ['xxxxxxx'],
    },
  },
  statueAltar: {
    constraints: {
      all: ['isFloor', 'isCenterAligned'],
    },
    key: ['carpet', 'statueDragon', 'wall'],
    object: {
      0: ['xxxxxx', '      '],
      1: ['x0000x', ' 1  1 '],
      2: ['x0000x', '  22  '],
      3: ['x0000x', '  22  '],
      4: ['x0000x', ' 1  1 '],
      5: ['xxxxxx', '      '],
    },
  },
}
