import { caveFace, caveFaceBase, caveWall, caveWallBase } from './walls'

const tWall = ['terrain', 'blocksLight', 'blocksMovement', 'wall']

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
  caveWall: caveWallBase,
  caveFace: caveFaceBase,
  caveWall1: caveWall(1),
  caveWall2: caveWall(2),
  caveWall3: caveWall(3),
  caveWall4: caveWall(4),
  caveWall5: caveWall(5),
  caveWall6: caveWall(6),
  caveFace1: caveFace(1),
  caveFace2: caveFace(2),
  caveFace3: caveFace(3),
  caveFace4: caveFace(4),
  caveFace5: caveFace(5),
  caveFace6: caveFace(6),
  dungeonWall: {
    name: 'wall',
    tiles: ['dungeonSolid1'],
    tag: [...tWall],
  },
  pitWall: {
    name: 'wall',
    tiles: ['pitSolid1'],
    tag: [...tWall],
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

/*

const tcave = {
  cave: {
    wall: {
      tile: ['caveSolid1', 'caveSolid2', 'caveSolid3', 'caveSolid4', 'caveSolid5', 'caveSolid6'],
      chance: [10, 5, 5, 5, 1, 1],
    },
    face: {
      tile: ['caveWall1', 'caveWall2', 'caveWall3', 'caveWall4', 'caveWall5', 'caveWall6'],
      chance: [20, 5, 5, 5, 5, 5, 5],
    },
  },
}

*/
