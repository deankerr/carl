import { EntityTemplate } from '../Core/Entity'

export type TerrainKey =
  | 'path'
  | 'wall'
  | 'water'
  | 'stairsDown'
  | 'stairsUp'
  | 'crackedWall'
  | 'grass'
  | 'deadGrass'
  | 'mound'
  | 'endlessVoid'
  | 'peak'
  | 'deadGrassD'
  | 'solidGreyPurple'
  | 'solidGreyPink'
  | 'brick'
  | 'ground'
  | 'solid'
  | 'unknown'
  | 'caveWall'
  | 'web'
  | 'sand'
  | 'T2caveSolid1'
  | 'T2caveSolid2'
  | 'T2caveSolid3'
  | 'T2caveSolid4'
  | 'T2caveSolid5'
  | 'T2caveSolid6'
  | 'T2caveWall1'
  | 'T2caveWall2'
  | 'T2caveWall3'
  | 'T2caveWall4'
  | 'T2caveWall5'
  | 'T2caveWall6'
  | 'T2caveFloor1'
  | 'T2caveFloor2'
  | 'T2caveFloor3'
  | 'T2caveFloor4'
  | 'T2caveFloor5'
  | 'T2caveFloor6'
  | 'T2caveFloorSL'
  | 'T2caveFloorSR'
  | 'T2caveFloorSB'

export const terrain: EntityTemplate[] = [
  {
    label: 'path',
    name: ['path'],
    form: ['path', '#262626'],
    tag: ['terrain', 'renderUnderBeing'],
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
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },
  {
    label: 'ground',
    name: ['ground'],
    form: ['solid', '#000'],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'unknown',
    name: ['unknown'],
    form: ['solid', '#F0F'],
    tag: ['terrain', 'blocksMovement'],
  },
  {
    label: 'endlessVoid',
    name: ['endless void'],
    form: ['v', '#FF00FF'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
  },
  {
    label: 'T2caveSolid1',
    name: ['solid rock'],
    form: ['caveSolid1', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },
  {
    label: 'T2caveSolid2',
    name: ['solid rock'],
    form: ['caveSolid2', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveSolid3',
    name: ['solid rock'],
    form: ['caveSolid3', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveSolid4',
    name: ['solid rock'],
    form: ['caveSolid4', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveSolid5',
    name: ['solid rock'],
    form: ['caveSolid5', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveSolid6',
    name: ['solid rock'],
    form: ['caveSolid6', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },
  {
    label: 'T2caveWall1',
    name: ['solid rock'],
    form: ['caveWall1', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveWall2',
    name: ['solid rock'],
    form: ['caveWall2', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveWall3',
    name: ['solid rock'],
    form: ['caveWall3', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveWall4',
    name: ['solid rock'],
    form: ['caveWall4', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },

  {
    label: 'T2caveWall5',
    name: ['solid rock'],
    form: ['caveWall5', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },
  {
    label: 'T2caveWall6',
    name: ['solid rock'],
    form: ['caveWall6', '#333'],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'renderUnderBeing'],
  },
  {
    label: 'T2caveFloor1',
    name: ['solid rock'],
    form: ['caveFloor1', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloor2',
    name: ['solid rock'],
    form: ['caveFloor2', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloor3',
    name: ['solid rock'],
    form: ['caveFloor3', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloor4',
    name: ['solid rock'],
    form: ['caveFloor4', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloor5',
    name: ['solid rock'],
    form: ['caveFloor5', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloor6',
    name: ['solid rock'],
    form: ['caveFloor6', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloorSL',
    name: ['solid rock'],
    form: ['caveFloorSL', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },

  {
    label: 'T2caveFloorSR',
    name: ['solid rock'],
    form: ['caveFloorSR', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'T2caveFloorSB',
    name: ['solid rock'],
    form: ['caveFloorSB', '#333'],
    tag: ['terrain', 'renderUnderBeing'],
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
