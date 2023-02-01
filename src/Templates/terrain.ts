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
  | 'void'
  | 'endlessVoid'
  | 'peak'
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
    form: ['wall', '#767676'],
    tag: ['blocksMovement', 'blocksLight', 'terrain'],
  },
  {
    label: 'water',
    name: ['water'],
    form: ['water', '#4084bf'],
    tag: ['terrain'],
    trodOn: ['You tread water.'],
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
  { label: 'grass', name: ['grass'], form: ['grass', '#65712b'], tag: ['terrain'] },
  { label: 'deadGrass', name: ['dead grass'], form: ['deadGrass', '#664f47'], tag: ['terrain'] },
  { label: 'mound', name: ['mound'], form: ['mound', '#6a4b39'], tag: ['blocksLight', 'terrain'] },
  { label: 'peak', name: ['peak'], form: ['peak', '#2a5a3e'], tag: ['blocksLight', 'terrain'] },
  {
    label: 'void',
    name: ['void'],
    form: ['void', '#FF00FF'],
    tag: ['terrain', 'renderUnderBeing'],
  },
  {
    label: 'endlessVoid',
    name: ['endless void'],
    form: ['v', '#FF00FF'],
    tag: ['blocksLight', 'blocksMovement', 'terrain'],
  },
]
