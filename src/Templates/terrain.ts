const wallTags = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

export const terrain = {
  water: {
    name: 'water',
    tiles: ['water1', 'water2'],
    tag: ['terrain'],
    tilesAutoCycle: 1000,
    tilesLedge: ['waterLedge1', 'waterLedge2'],
  },
  slime: {
    name: 'slime',
    tiles: ['slime1', 'slime2'],
    tag: ['terrain'],
    tilesAutoCycle: 1000,
    tilesLedge: ['slimeLedge1', 'slimeLedge2'],
  },
  oil: {
    name: 'oil',
    tiles: ['oil1', 'oil2'],
    tag: ['terrain'],
    tilesAutoRandom: 1000,
    tilesLedge: ['oilLedge1', 'oilLedge2'],
  },
  acid: {
    name: 'acid',
    tiles: ['acid1', 'acid2', 'acidClear'],
    tag: ['terrain'],
    tilesAutoRandom: 1000,
    tilesLedge: ['acidLedge1', 'acidLedge2', 'acidClearLedge'],
  },
  blood: {
    name: 'blood',
    tiles: ['blood1', 'blood2'],
    tag: ['terrain'],
    tilesAutoCycle: 1000,
    tilesLedge: ['bloodLedge1', 'bloodLedge2'],
  },
  sludge: {
    name: 'sludge',
    tiles: ['sludge1', 'sludge2'],
    tag: ['terrain'],
    tilesAutoRandom: 1000,
    tilesLedge: ['sludgeLedge1', 'sludgeLedge2'],
  },
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
  sand: {
    name: 'sand',
    tiles: ['sand'],
    tag: ['terrain'],
    tilesLedge: ['sandLedge'],
  },
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
  caveWall: {
    name: 'wall',
    tiles: ['caveVertical1'],
    tilesVertical: ['caveVertical1', 'caveVertical2', 'caveVertical3', 'caveVertical4'],
    tilesHorizontal: ['caveHorizontal1', 'caveHorizontal2', 'caveHorizontal3', 'caveHorizontal4'],
    tag: [...wallTags],
  },
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
  pitWall: {
    name: 'wall',
    tiles: ['pitVertical1'],
    tilesVertical: ['pitVertical1', 'pitVertical2', 'pitVertical3', 'pitVertical4'],
    tilesHorizontal: ['pitHorizontal1', 'pitHorizontal2', 'pitHorizontal3', 'pitHorizontal4'],
    tag: [...wallTags],
  },
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
    tag: ['terrain', 'pickTile'],
  },
  dirtFloor: {
    name: 'floor',
    tiles: ['dirtFloor1', 'dirtFloor2', 'dirtFloor3', 'dirtFloor4', 'dirtFloor5', 'dirtFloor6'],
    tag: ['terrain', 'pickTile'],
  },
  dirtFloorHole: {
    name: 'hole',
    tiles: ['unknown', 'dirtFloorHoleLedge'],
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
    tag: ['terrain', 'pickTile'],
  },
} as const
