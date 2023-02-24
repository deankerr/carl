import { EntityTemplate, Tag } from '../Core'

const wallTags: Tag[] = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

export const terrain = {
  // Liquid
  water: {
    name: 'water',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['water1', 'water2'],
      ledge: ['waterLedge1', 'waterLedge2'],
      animate: ['cycle', 1000],
    },
  },

  slime: {
    name: 'slime',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['slime1', 'slime2'],
      ledge: ['slimeLedge1', 'slimeLedge2'],
      animate: ['cycle', 1000],
    },
  },

  oil: {
    name: 'oil',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['oil1', 'oil2'],
      ledge: ['oilLedge1', 'oilLedge2'],
      animate: ['random', 1000],
    },
  },

  acid: {
    name: 'acid',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['acid1', 'acid2', 'acidClear'],
      ledge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
      animate: ['random', 1000],
    },
  },

  blood: {
    name: 'blood',
    tag: ['terrain', 'liquid'],
    sprite: {
      base: ['blood1', 'blood2', 'bloodClear'],
      ledge: ['bloodLedge1', 'bloodLedge2', 'bloodClearLedge'],
      animate: ['random', 1000],
    },
  },

  sludge: {
    name: 'sludge',
    tag: ['terrain', 'liquid'],
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
    tag: [...wallTags],
    sprite: {
      base: ['dungeonVertical1', 'dungeonVertical2', 'dungeonVertical3', 'dungeonVertical4'],
      exposed: [
        'dungeonHorizontal1',
        'dungeonHorizontal2',
        'dungeonHorizontal3',
        'dungeonHorizontal4',
      ],
      noise: [0],
    },
  },

  dungeonPool: {
    name: 'well',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['dungeonWell'],
    },
  },

  // cave theme
  caveWall: {
    name: 'wall',
    tag: [...wallTags],
    sprite: {
      base: ['caveVertical1', 'caveVertical2', 'caveVertical3', 'caveVertical4'],
      exposed: ['caveHorizontal1', 'caveHorizontal2', 'caveHorizontal3', 'caveHorizontal4'],
      noise: [0],
    },
  },

  cavePool: {
    name: 'well',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['caveWell'],
    },
  },

  // crypt theme
  cryptWall: {
    name: 'wall',
    tag: [...wallTags],
    sprite: {
      base: ['cryptVertical1', 'cryptVertical2', 'cryptVertical3', 'cryptVertical4'],
      exposed: ['cryptHorizontal1', 'cryptHorizontal2', 'cryptHorizontal3', 'cryptHorizontal4'],
      noise: [0],
    },
  },

  cryptPool: {
    name: 'well',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['cryptWell'],
    },
  },

  // cavern theme
  cavernWall: {
    name: 'wall',
    tag: [...wallTags],
    sprite: {
      base: ['cavernVertical1', 'cavernVertical2', 'cavernVertical3', 'cavernVertical4'],
      exposed: ['cavernHorizontal1', 'cavernHorizontal2', 'cavernHorizontal3', 'cavernHorizontal4'],
      noise: [0],
    },
  },

  cavernPool: {
    name: 'well',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['cavernWell'],
    },
  },

  // Floor
  stoneFloor: {
    name: 'floor',

    tag: ['terrain', 'floor'],
    sprite: {
      base: [
        'stoneFloor1',
        'stoneFloor2',
        'stoneFloor3',
        'stoneFloor4',
        'stoneFloor5',
        'stoneFloor6',
      ],
      noise: [0],
    },
  },

  dirtFloor: {
    name: 'dirt',
    tag: ['terrain', 'floor'],
    sprite: {
      base: ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
      noise: [0],
    },
  },

  dirtFloorOutdoor: {
    name: 'dirt',
    tag: ['terrain', 'floor'],
    sprite: {
      base: [
        'dirtFloorOutdoor2',
        'dirtFloorOutdoor3',
        'dirtFloorOutdoor4',
        'dirtFloorOutdoor5',
        'dirtFloorOutdoor6',
      ],
      ledgeOverlay: ['dirtLedge'],
      noise: [0],
    },
  },

  dirtPath: {
    name: 'path',
    tag: ['terrain'],
    sprite: {
      base: ['dirtTiles1', 'dirtTiles2', 'dirtTiles3'],
      noise: [0],
    },
  },

  dirtFloorPit: {
    name: 'hole',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['dirtFloorPit'],
    },
  },

  stoneTileFloor: {
    name: 'floor',
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
      noise: [0],
    },
  },

  stonePebbleFloor: {
    name: 'floor',
    tag: ['terrain', 'floor'],
    sprite: {
      base: [
        'stonePebbleFloor1',
        'stonePebbleFloor2',
        'stonePebbleFloor3',
        'stonePebbleFloor4',
        'stonePebbleFloor5',
      ],
      noise: [0],
    },
  },

  grassFloor: {
    name: 'grass',
    tag: ['terrain', 'floor'],
    sprite: {
      base: ['grass1', 'grass2', 'grass3', 'grass4', 'grass5', 'grass6'],
      noise: [0],
    },
  },

  grassPath: {
    name: 'path',
    tag: ['terrain'],
    sprite: {
      base: ['grassTiles1', 'grassTiles2', 'grassTiles3'],
      noise: [0],
    },
  },

  grassTile: {
    name: 'path',
    tag: ['terrain'],
    sprite: {
      base: ['grassTile'],
    },
  },

  sand: {
    name: 'sand',
    tag: ['terrain'],
    sprite: {
      base: ['sand'],
    },
  },

  bridgeFloor: {
    name: 'bridge',
    tag: ['terrain', 'floor'],
    sprite: {
      base: ['woodenBoards1', 'woodenBoards2', 'woodenBoards3', 'woodenPanel'],
      noise: [0],
    },
  },

  // Building
  buildingWindow: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingWindow1', 'buildingWindow2'],
      noise: [0],
    },
  },

  buildingEntry: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingDoor'],
    },
  },

  buildingRoofFront: {
    name: 'building',
    tag: ['terrain', 'blocksMovement'],
    sprite: {
      base: ['buildingRoofFront1', 'buildingRoofFront2'],
      noise: [0],
    },
  },

  buildingRoof: {
    name: 'building',
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
    sprite: {
      base: ['buildingRoof1', 'buildingRoofFront2'],
    },
  },

  buildingChimney: {
    name: 'building',
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
    sprite: {
      base: ['buildingChimney'],
    },
  },

  // Utility
  nothing: {
    name: 'nothing',
    tag: ['terrain'],
    sprite: {
      base: ['nothing'],
    },
  },

  unrevealed: {
    name: 'unrevealed',
    tag: ['terrain'],
    sprite: {
      base: ['abyss'],
    },
  },

  abyss: {
    name: 'abyss',
    tag: ['terrain', 'blocksLight', 'blocksMovement'],
    sprite: {
      base: ['abyss'],
    },
  },

  endlessVoid: {
    name: 'endless void',
    tag: ['terrain', 'outOfBounds', 'blocksLight', 'blocksMovement'],
    sprite: {
      base: ['abyss'],
    },
  },
} satisfies Record<string, EntityTemplate>
