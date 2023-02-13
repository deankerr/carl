const wallTags = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

export const terrain = {
  water: {
    name: 'water',
    tiles: ['water1', 'water2'],
    tag: ['terrain', 'isBase'],
    tilesAutoCycle: 1000,
    ledgeVariant: 'waterLedge',
  },
  waterLedge: {
    name: 'water',
    tiles: ['waterLedge1', 'waterLedge2'],
    tag: ['terrain', 'isLedge'],
    tilesAutoCycle: 1000,
    baseVariant: 'water',
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
    tiles: ['stoneFloor1'],
    tag: ['terrain'],
  },
  dirtFloor: {
    name: 'floor',
    tiles: ['dirtFloor1'],
    tag: ['terrain'],
  },
} as const
