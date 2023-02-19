const wallTags = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

export const terrain = {
  // Liquid
  water: {
    name: 'water',
    tiles: ['W'],
    tag: ['terrain', 'liquid'],
    tilesLedge: ['waterLedge1', 'waterLedge2'],
    sprite: {
      base: ['water1', 'water2'],
      ledge: ['waterLedge1', 'waterLedge2'],
      animate: ['cycle', 1000],
    },
  },

  slime: {
    name: 'slime',
    tiles: ['slime1', 'slime2'],
    tag: ['terrain', 'liquid'],
    tilesAutoCycle: 1000,
    tilesLedge: ['slimeLedge1', 'slimeLedge2'],
    sprite: {
      base: ['slime1', 'slime2'],
      ledge: ['slimeLedge1', 'slimeLedge2'],
      animate: ['cycle', 1000],
    },
  },

  oil: {
    name: 'oil',
    tiles: ['oil1', 'oil2'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['oilLedge1', 'oilLedge2'],
    sprite: {
      base: ['oil1', 'oil2'],
      ledge: ['oilLedge1', 'oilLedge2'],
      animate: ['random', 1000],
    },
  },

  acid: {
    name: 'acid',
    tiles: ['acid1', 'acid2', 'acidClear'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
    sprite: {
      base: ['acid1', 'acid2', 'acidClear'],
      ledge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
      animate: ['random', 1000],
    },
  },

  blood: {
    name: 'blood',
    tiles: ['blood1', 'blood2', 'bloodClear'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['bloodLedge1', 'bloodLedge2', 'bloodClearLedge'],
    sprite: {
      base: ['blood1', 'blood2', 'bloodClear'],
      ledge: ['bloodLedge1', 'bloodLedge2', 'bloodClearLedge'],
      animate: ['random', 1000],
    },
  },

  sludge: {
    name: 'sludge',
    tiles: ['sludge1', 'sludge2'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['sludgeLedge1', 'sludgeLedge2'],
    sprite: {
      base: ['sludge1', 'sludge2'],
      ledge: ['sludgeLedge1', 'sludgeLedge2'],
      animate: ['random', 1000],
    },
  },

  // Wall/Structural
  // dungeon theme
  dungeonWall: {
    name: 'wall',
    tiles: ['dungeonVertical1'],
    tilesVertical: ['dungeonVertical1', 'dungeonVertical2', 'dungeonVertical3', 'dungeonVertical4'],
    tilesHorizontal: [
      'dungeonHorizontal1',
      'dungeonHorizontal2',
      'dungeonHorizontal3',
      'dungeonHorizontal4',
    ],
    tag: [...wallTags],
    sprite: {
      base: ['dungeonVertical1', 'dungeonVertical2', 'dungeonVertical3', 'dungeonVertical4'],
      exposed: [
        'dungeonHorizontal1',
        'dungeonHorizontal2',
        'dungeonHorizontal3',
        'dungeonHorizontal4',
      ],
      noise: [1],
    },
  },

  dungeonPool: {
    name: 'well',
    tiles: ['dungeonWell'],
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['dungeonWell'],
    },
  },

  // cave theme
  caveWall: {
    name: 'wall',
    tiles: ['caveVertical1'],
    tilesVertical: ['caveVertical1', 'caveVertical2', 'caveVertical3', 'caveVertical4'],
    tilesHorizontal: ['caveHorizontal1', 'caveHorizontal2', 'caveHorizontal3', 'caveHorizontal4'],
    tag: [...wallTags],
    sprite: {
      base: ['caveVertical1', 'caveVertical2', 'caveVertical3', 'caveVertical4'],
      exposed: ['caveHorizontal1', 'caveHorizontal2', 'caveHorizontal3', 'caveHorizontal4'],
      noise: [1],
    },
  },

  cavePool: {
    name: 'well',
    tiles: ['caveWell'],
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['caveWell'],
    },
  },

  // crypt theme
  cryptWall: {
    name: 'wall',
    tiles: ['cryptVertical1'],
    tilesVertical: ['cryptVertical1', 'cryptVertical2', 'cryptVertical3', 'cryptVertical4'],
    tilesHorizontal: [
      'cryptHorizontal1',
      'cryptHorizontal2',
      'cryptHorizontal3',
      'cryptHorizontal4',
    ],
    tag: [...wallTags],
    sprite: {
      base: ['cryptVertical1', 'cryptVertical2', 'cryptVertical3', 'cryptVertical4'],
      exposed: ['cryptHorizontal1', 'cryptHorizontal2', 'cryptHorizontal3', 'cryptHorizontal4'],
      noise: [1],
    },
  },

  cryptPool: {
    name: 'well',
    tiles: ['cryptWell'],
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['cryptWell'],
    },
  },

  // cavern theme
  cavernWall: {
    name: 'wall',
    tiles: ['cavernVertical1'],
    tilesVertical: ['cavernVertical1', 'cavernVertical2', 'cavernVertical3', 'cavernVertical4'],
    tilesHorizontal: [
      'cavernHorizontal1',
      'cavernHorizontal2',
      'cavernHorizontal3',
      'cavernHorizontal4',
    ],
    tag: [...wallTags],
    sprite: {
      base: ['cavernVertical1', 'cavernVertical2', 'cavernVertical3', 'cavernVertical4'],
      exposed: ['cavernHorizontal1', 'cavernHorizontal2', 'cavernHorizontal3', 'cavernHorizontal4'],
      noise: [1],
    },
  },

  cavernPool: {
    name: 'well',
    tiles: ['cavernWell'],
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['cavernWell'],
    },
  },

  // Floor
  stoneFloor: {
    name: 'floor',
    tiles: [
      'stoneFloor1',
      'stoneFloor2',
      'stoneFloor3',
      'stoneFloor4',
      'stoneFloor5',
      'stoneFloor6',
    ],
    tag: ['terrain', 'floor', 'pickTile'],
    sprite: {
      base: [
        'stoneFloor1',
        'stoneFloor2',
        'stoneFloor3',
        'stoneFloor4',
        'stoneFloor5',
        'stoneFloor6',
      ],
      noise: [1],
    },
  },

  dirtFloor: {
    name: 'floor',
    tiles: ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    tag: ['terrain', 'floor', 'pickTile'],
    sprite: {
      base: ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
      noise: [1],
    },
  },

  dirtFloorDetailed: {
    name: 'floor',
    tiles: ['dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    tag: ['terrain', 'floor', 'pickTileEqually'],
    sprite: {
      base: ['dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
      noise: [1],
    },
  },

  dirtPath: {
    name: 'path',
    tiles: ['dirtTiles1', 'dirtTiles2', 'dirtTiles3'],
    tag: ['terrain', 'pickTile'],
    sprite: {
      base: ['dirtTiles1', 'dirtTiles2', 'dirtTiles3'],
      noise: [1],
    },
  },

  dirtFloorPit: {
    name: 'hole',
    tiles: ['unknown', 'dirtFloorPit'],
    tag: ['terrain', 'blocksMovement', 'pickTileLedge'],
    sprite: {
      base: ['dirtFloorPit'],
    },
  },

  stoneTileFloor: {
    name: 'floor',
    tiles: [
      'stoneTileFloor3',
      'stoneTileFloor1',
      'stoneTileFloor2',
      'stoneTileFloor4',
      'mossTileFloor1',
      'mossTileFloor2',
      'mossTileFloor3',
      'mossTileFloor4',
      'mossTileFloor5',
    ],
    tag: ['terrain', 'floor'],
    sprite: {
      base: [
        'stoneTileFloor3',
        'stoneTileFloor1',
        'stoneTileFloor2',
        'stoneTileFloor4',
        'mossTileFloor1',
        'mossTileFloor2',
        'mossTileFloor3',
        'mossTileFloor4',
        'mossTileFloor5',
      ],
      noise: [1, 1, 1, 1, 1, 1, 1, 1],
    },
  },

  stonePebbleFloor: {
    name: 'floor',
    tiles: [
      'stonePebbleFloor1',
      'stonePebbleFloor2',
      'stonePebbleFloor3',
      'stonePebbleFloor4',
      'stonePebbleFloor5',
    ],
    tag: ['terrain', 'floor', 'pickTileEqually'],
    sprite: {
      base: [
        'stonePebbleFloor1',
        'stonePebbleFloor2',
        'stonePebbleFloor3',
        'stonePebbleFloor4',
        'stonePebbleFloor5',
      ],
      noise: [1],
    },
  },

  grassFloor: {
    name: 'grass',
    tiles: ['grass1', 'grass2', 'grass3', 'grass4', 'grass5', 'grass6'],
    tag: ['terrain', 'floor', 'pickTile'],
    sprite: {
      base: ['grass1', 'grass2', 'grass3', 'grass4', 'grass5', 'grass6'],
      noise: [1, 1, 1, 1, 1, 1],
    },
  },

  grassPath: {
    name: 'path',
    tiles: ['grassTiles1', 'grassTiles2', 'grassTiles3'],
    tag: ['terrain', 'pickTile'],
    sprite: {
      base: ['grassTiles1', 'grassTiles2', 'grassTiles3'],
      noise: [1],
    },
  },

  grassTile: {
    name: 'path',
    tiles: ['grassTile'],
    tag: ['terrain'],
    sprite: {
      base: ['grassTile'],
    },
  },

  sand: {
    name: 'sand',
    tiles: ['sand'],
    tag: ['terrain'],
    tilesLedge: ['sandLedge'],
    sprite: {
      base: ['sand'],
    },
  },

  bridgeFloor: {
    name: 'bridge',
    tiles: ['woodenBoards1', 'woodenBoards2', 'woodenBoards3', 'woodenPanel'],
    tag: ['terrain', 'floor', 'pickTileEqually'],
    sprite: {
      base: ['woodenBoards1', 'woodenBoards2', 'woodenBoards3', 'woodenPanel'],
      noise: [1],
    },
  },

  // Building
  buildingWindow: {
    name: 'building',
    tiles: ['buildingWindow1', 'buildingWindow2'],
    tag: ['terrain', 'blocksMovement', 'pickTile'],
    sprite: {
      base: ['buildingWindow1', 'buildingWindow2'],
      noise: [1],
    },
  },

  buildingEntry: {
    name: 'building',
    tiles: ['buildingDoor'],
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingDoor'],
    },
  },

  buildingRoofFront: {
    name: 'building',
    tiles: ['buildingRoofFront1', 'buildingRoofFront2'],
    tag: ['terrain', 'blocksMovement', 'pickTile'],
    sprite: {
      base: ['buildingRoofFront1', 'buildingRoofFront2'],
      noise: [1],
    },
  },

  buildingRoof: {
    name: 'building',
    tiles: ['buildingRoof1', 'buildingRoof2'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'pickTile'],
    sprite: {
      base: ['buildingRoof1', 'buildingRoofFront2'],
    },
  },

  buildingChimney: {
    name: 'building',
    tiles: ['buildingChimney'],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
    sprite: {
      base: ['buildingChimney'],
    },
  },

  // Utility
  nothing: {
    name: 'nothing',
    tiles: ['nothing'],
    tag: ['terrain'],
    sprite: {
      base: ['nothing'],
    },
  },

  unknown: {
    name: 'unknown',
    tiles: ['unknown'],
    tag: ['terrain'],
    sprite: {
      base: ['unknown'],
    },
  },

  endlessVoid: {
    name: 'endless void',
    tiles: ['unknown'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
    sprite: {
      base: ['unknown'],
    },
  },
} as const
