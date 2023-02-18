const wallTags = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

export const terrain = {
  // Liquid
  water: {
    name: 'water',
    tiles: ['water1', 'water2'],
    tag: ['terrain', 'liquid'],
    tilesAutoCycle: 1000,
    tilesLedge: ['waterLedge1', 'waterLedge2'],
  },

  slime: {
    name: 'slime',
    tiles: ['slime1', 'slime2'],
    tag: ['terrain', 'liquid'],
    tilesAutoCycle: 1000,
    tilesLedge: ['slimeLedge1', 'slimeLedge2'],
  },

  oil: {
    name: 'oil',
    tiles: ['oil1', 'oil2'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['oilLedge1', 'oilLedge2'],
  },

  acid: {
    name: 'acid',
    tiles: ['acid1', 'acid2', 'acidClear'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
  },

  blood: {
    name: 'blood',
    tiles: ['blood1', 'blood2', 'bloodClear'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['bloodLedge1', 'bloodLedge2', 'bloodClearLedge'],
  },

  sludge: {
    name: 'sludge',
    tiles: ['sludge1', 'sludge2'],
    tag: ['terrain', 'liquid'],
    tilesAutoRandom: 1500,
    tilesLedge: ['sludgeLedge1', 'sludgeLedge2'],
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
  },

  dungeonPool: {
    name: 'well',
    tiles: ['dungeonWell'],
    tag: ['terrain', 'blocksMovement'],
  },

  // cave theme
  caveWall: {
    name: 'wall',
    tiles: ['caveVertical1'],
    tilesVertical: ['caveVertical1', 'caveVertical2', 'caveVertical3', 'caveVertical4'],
    tilesHorizontal: ['caveHorizontal1', 'caveHorizontal2', 'caveHorizontal3', 'caveHorizontal4'],
    tag: [...wallTags],
  },

  cavePool: {
    name: 'well',
    tiles: ['caveWell'],
    tag: ['terrain', 'blocksMovement'],
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
  },

  cryptPool: {
    name: 'well',
    tiles: ['cryptWell'],
    tag: ['terrain', 'blocksMovement'],
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
  },

  cavernPool: {
    name: 'well',
    tiles: ['cavernWell'],
    tag: ['terrain', 'blocksMovement'],
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
  },

  dirtFloor: {
    name: 'floor',
    tiles: ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    tag: ['terrain', 'floor', 'pickTile'],
  },

  dirtFloorDetailed: {
    name: 'floor',
    tiles: ['dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    tag: ['terrain', 'floor', 'pickTileEqually'],
  },

  dirtPath: {
    name: 'path',
    tiles: ['dirtTiles1', 'dirtTiles2', 'dirtTiles3'],
    tag: ['terrain', 'pickTile'],
  },

  dirtFloorPit: {
    name: 'hole',
    tiles: ['unknown', 'dirtFloorPit'],
    tag: ['terrain', 'blocksMovement', 'pickTileLedge'],
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
    tag: ['terrain', 'floor', 'pickTile'],
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
  },

  grassFloor: {
    name: 'grass',
    tiles: ['grass1', 'grass2', 'grass3', 'grass4', 'grass5', 'grass6'],
    tag: ['terrain', 'floor', 'pickTile'],
  },

  grassPath: {
    name: 'path',
    tiles: ['grassTiles1', 'grassTiles2', 'grassTiles3'],
    tag: ['terrain', 'pickTile'],
  },

  grassTile: {
    name: 'path',
    tiles: ['grassTile'],
    tag: ['terrain'],
  },

  sand: {
    name: 'sand',
    tiles: ['sand'],
    tag: ['terrain'],
    tilesLedge: ['sandLedge'],
  },

  bridgeFloor: {
    name: 'bridge',
    tiles: ['woodenBoards1', 'woodenBoards2', 'woodenBoards3', 'woodenPanel'],
    tag: ['terrain', 'floor', 'pickTileEqually'],
  },

  // Building
  buildingWindow: {
    name: 'building',
    tiles: ['buildingWindow1', 'buildingWindow2'],
    tag: ['terrain', 'blocksMovement', 'pickTile'],
  },

  buildingEntry: {
    name: 'building',
    tiles: ['buildingDoor'],
    tag: ['terrain', 'blocksMovement'],
  },

  buildingRoofFront: {
    name: 'building',
    tiles: ['buildingRoofFront1', 'buildingRoofFront2'],
    tag: ['terrain', 'blocksMovement', 'pickTile'],
  },

  buildingRoof: {
    name: 'building',
    tiles: ['buildingRoof1', 'buildingRoof2'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'pickTile'],
  },

  buildingChimney: {
    name: 'building',
    tiles: ['buildingChimney'],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },

  // Utility
  nothing: {
    name: 'nothing',
    tiles: ['nothing'],
    tag: ['terrain'],
  },

  unknown: {
    name: 'unknown',
    tiles: ['unknown'],
    tag: ['terrain'],
  },

  endlessVoid: {
    name: 'endless void',
    tiles: ['unknown'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
  },
} as const
