// import { EntityTemplate } from '../../Core/Entity'

// export type TerrainKey =
//   | 'path'
//   | 'wall'
//   | 'water'
//   | 'stairsDown'
//   | 'stairsUp'
//   | 'crackedWall'
//   | 'grass'
//   | 'deadGrass'
//   | 'mound'
//   | 'endlessVoid'
//   | 'peak'
//   | 'deadGrassD'
//   | 'solidGreyPurple'
//   | 'solidGreyPink'
//   | 'brick'
//   | 'ground'
//   | 'solid'
//   | 'unknown'
//   | 'caveWall'
//   | 'web'
//   | 'sand'
//   | 'caveSolid'
//   | 'caveSolid1'
//   | 'caveSolid2'
//   | 'caveSolid3'
//   | 'caveSolid4'
//   | 'caveSolid5'
//   | 'caveSolid6'
//   | 'caveWall1'
//   | 'dirtFloor1'

export const terrain = [
  {
    label: 'path',
    name: ['path'],
    form: ['path', '#262626'],
    tag: ['terrain'],
  },
  {
    label: 'wall',
    name: ['wall'],
    form: ['wall', '#4f4f4f'],
    tag: ['blocksMovement', 'blocksLight', 'terrain'],
  },

  {
    label: 'water',
    name: ['water'],
    form: ['water1', '#40a3e5', '#020927'], //  bg '#070f31'
    tag: ['terrain'],
    formSet: [['water1', '', '', 'water2', '', '']],
    formSetAutoCycle: [1000],
    // trodOn: ['You tread water.'],
  },
  {
    label: 'stairsDown',
    name: ['descending stairs'],
    form: ['stairsDown', '#767676'],
    tag: ['terrain'],
    trodOn: ["There's some stairs leading down here."],
  },
  {
    label: 'stairsUp',
    name: ['ascending'],
    form: ['stairsUp', '#767676'],
    tag: ['terrain'],
    trodOn: ["There's some stairs leading up here."],
  },
  {
    label: 'crackedWall',
    name: ['cracked wall'],
    form: ['crackedWall', '#767676'],
    tag: ['blocksMovement', 'blocksLight', 'terrain'],
  },
  { label: 'grass', name: ['grass'], form: ['grass', '#414c12'], tag: ['terrain'] },
  { label: 'deadGrass', name: ['dead grass'], form: ['deadGrass', '#664f47'], tag: ['terrain'] },
  { label: 'mound', name: ['mound'], form: ['mound', '#4d372a'], tag: ['blocksLight', 'terrain'] },
  { label: 'peak', name: ['peak'], form: ['peak', '#004027'], tag: ['blocksLight', 'terrain'] },
  { label: 'sand', name: ['sand'], form: ['sand', '#7b600a'], tag: ['terrain'] }, // b99009
  {
    label: 'brick',
    name: ['bricks'],
    form: ['brick', '#6c373c', '#221e24'],
    tag: ['blocksMovement', 'terrain'],
  },
  {
    label: 'caveWall',
    name: ['wall'],
    form: ['caveWall', '#6c373c', '#221e24'],
    tag: ['blocksMovement', 'terrain'],
  },
  {
    label: 'web',
    name: ['web'],
    form: ['web', '#EEE'],
    tag: ['terrain'],
  },
  {
    label: 'nest',
    name: ['nest'],
    form: ['nest', '#732b55'],
    tag: ['terrain'],
  },
  {
    label: 'solid',
    name: ['solid rock'],
    form: ['solid', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'ground',
    name: ['ground'],
    form: ['dirtFloor2', '#000'],
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
    form: ['v', '#FF00FF'],
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
    label: 'caveWall1',
    name: ['wall'],
    form: ['caveWall1', '', ''],
    tag: ['terrain', 'blocksMovement'],
  },
  {
    label: 'dirtFloor1',
    name: ['wall'],
    form: ['dirtFloor1', '', ''],
    tag: ['terrain'],
  },
]
/*
  moved to dynamic palette

  {
    label: 'solidGreyPurple',
    name: ['solid rock'],
    form: ['solid', '#342f37'],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  {
    label: 'solidGreyPink',
    name: ['solid rock'],
    form: ['solid', '#6c373c'],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },


*/
