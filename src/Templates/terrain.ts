import { EntityTemplate } from '../Core/Entity'
import { series } from './series'

export const terrain: EntityTemplate[] = [
  {
    label: 'water',
    name: ['water'],
    form: ['water1', ''],
    tag: ['terrain'],
    formSet: [['water1', '', '', 'water2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'waterFace',
    name: ['water'],
    form: ['waterFace1', ''],
    tag: ['terrain', 'face'],
    formSet: [['waterFace1', '', '', 'waterFace2', '', '']],
    formSetAutoCycle: [1000],
  },
  {
    label: 'nothing',
    name: ['nothing'],
    form: ['nothing', ''],
    tag: ['terrain'],
  },
  {
    label: 'unknown',
    name: ['unknown'],
    form: ['unknown', ''],
    tag: ['terrain'],
  },
  {
    label: 'endlessVoid',
    name: ['endless void'],
    form: ['unknown', ''],
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
  ...series('floor', 'stone', 6),
  ...series('floor', 'dirt', 6),
  {
    label: 'sand',
    name: ['sand'],
    form: ['sand', '', ''],
    tag: ['terrain'],
  },
  {
    label: 'sandFace',
    name: ['sand'],
    form: ['sandFace', '', ''],
    tag: ['terrain'],
  },
]

export type TerrainKey =
  | 'nothing'
  | 'water'
  | 'waterFace'
  | 'endlessVoid'
  | 'unknown'
  | 'dungeonSolid'
  | 'dungeonSolid1'
  | 'dungeonSolid2'
  | 'dungeonSolid3'
  | 'dungeonSolid4'
  | 'dungeonSolid5'
  | 'dungeonSolid6'
  | 'dungeonWall'
  | 'dungeonWall1'
  | 'dungeonWall2'
  | 'dungeonWall3'
  | 'dungeonWall4'
  | 'dungeonWall5'
  | 'dungeonWall6'
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
  | 'pitSolid'
  | 'pitSolid1'
  | 'pitSolid2'
  | 'pitSolid3'
  | 'pitSolid4'
  | 'pitSolid5'
  | 'pitSolid6'
  | 'pitWall'
  | 'pitWall1'
  | 'pitWall2'
  | 'pitWall3'
  | 'pitWall4'
  | 'pitWall5'
  | 'pitWall6'
  | 'stoneFloor'
  | 'stoneFloor1'
  | 'stoneFloor2'
  | 'stoneFloor3'
  | 'stoneFloor4'
  | 'stoneFloor5'
  | 'stoneFloor6'
  | 'dirtFloor'
  | 'dirtFloor1'
  | 'dirtFloor2'
  | 'dirtFloor3'
  | 'dirtFloor4'
  | 'dirtFloor5'
  | 'dirtFloor6'
  | 'sand'
  | 'sandFace'

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
