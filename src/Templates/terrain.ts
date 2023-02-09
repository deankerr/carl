import { EntityTemplate } from '../Core/Entity'
import { series } from './series'

export type TerrainKey =
  | 'nothing'
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
  | 'sand'
  | 'sandFace'

export const terrain: EntityTemplate[] = [
  {
    label: 'water',
    name: ['water'],
    form: ['water1', '#40a3e5', '#020927'],
    tag: ['terrain', 'renderUnderBeing'],
    formSet: [['water1', '', '', 'water2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'waterFace',
    name: ['water'],
    form: ['waterFace1', '#40a3e5', '#020927'],
    tag: ['terrain', 'face', 'renderUnderBeing'],
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
  ...series('solid', 'dungeon', 6),
  ...series('face', 'dungeon', 6),
  ...series('solid', 'cave', 6),
  ...series('face', 'cave', 6),
  ...series('solid', 'tomb', 6),
  ...series('face', 'tomb', 6),
  ...series('solid', 'pit', 6),
  ...series('face', 'pit', 6),
  ...series('floor', 'dirt', 6),

  {
    label: 'sand',
    name: ['sand'],
    form: ['sand', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'sandFace',
    name: ['sand'],
    form: ['sandFace', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
  ...series('solid', 'dungeon', 6),
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
