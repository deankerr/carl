export const CSPVar = {
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
    key: ['webCorner'],
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
