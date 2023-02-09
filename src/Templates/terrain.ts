import { EntityTemplate } from '../Core/Entity'

export type TerrainKey =
  | 'water'
  | 'waterFace'
  | 'endlessVoid'
  | 'unknown'
  | 'caveWall'
  | 'caveSolid'
  | 'caveSolid1'
  | 'caveSolid2'
  | 'caveSolid3'
  | 'caveSolid4'
  | 'caveSolid5'
  | 'caveSolid6'
  | 'caveWall'
  | 'caveWall1'
  | 'caveWall2'
  | 'caveWall3'
  | 'caveWall4'
  | 'caveWall5'
  | 'caveWall6'
  | 'dirtFloor'
  | 'dirtFloor1'
  | 'dirtFloor2'
  | 'dirtFloor3'
  | 'dirtFloor4'
  | 'dirtFloor5'
  | 'dirtFloor6'
  | 'nothing'

export const terrain: EntityTemplate[] = [
  {
    label: 'water',
    name: ['water'],
    form: ['water1', '#40a3e5', '#020927'],
    tag: ['terrain'],
    formSet: [['water1', '', '', 'water2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'waterFace',
    name: ['water'],
    form: ['waterFace1', '#40a3e5', '#020927'],
    tag: ['terrain', 'face'],
    formSet: [['waterFace1', '', '', 'waterFace2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'nothing',
    name: ['nothing'],
    form: ['nothing', '#F0F'],
    tag: ['terrain'],
  },
  {
    label: 'unknown',
    name: ['unknown'],
    form: ['unknown', '#F0F'],
    tag: ['terrain'],
  },
  {
    label: 'endlessVoid',
    name: ['endless void'],
    form: ['unknown', '#FF00FF'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
  },
  {
    label: 'caveSolid',
    name: ['wall'],
    form: ['caveSolid1', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid1',
    name: ['wall'],
    form: ['caveSolid1', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid2',
    name: ['wall'],
    form: ['caveSolid2', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid3',
    name: ['wall'],
    form: ['caveSolid3', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid4',
    name: ['wall'],
    form: ['caveSolid4', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid5',
    name: ['wall'],
    form: ['caveSolid5', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveSolid6',
    name: ['wall'],
    form: ['caveSolid6', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'caveWall',
    name: ['wall'],
    form: ['caveWall', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall1',
    name: ['wall'],
    form: ['caveWall1', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall2',
    name: ['wall'],
    form: ['caveWall2', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall3',
    name: ['wall'],
    form: ['caveWall3', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall4',
    name: ['wall'],
    form: ['caveWall4', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall5',
    name: ['wall'],
    form: ['caveWall5', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'caveWall6',
    name: ['wall'],
    form: ['caveWall6', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  {
    label: 'dirtFloor',
    name: ['wall'],
    form: ['dirtFloor1', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor1',
    name: ['wall'],
    form: ['dirtFloor1', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor2',
    name: ['wall'],
    form: ['dirtFloor2', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor3',
    name: ['wall'],
    form: ['dirtFloor3', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor4',
    name: ['wall'],
    form: ['dirtFloor4', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor5',
    name: ['wall'],
    form: ['dirtFloor5', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'dirtFloor6',
    name: ['wall'],
    form: ['dirtFloor6', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
]

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
