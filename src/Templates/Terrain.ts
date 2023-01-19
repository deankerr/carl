import { Entity, hydrate } from '../Core/Entity'

export type TerrainTemplate = typeof Terrain[keyof typeof Terrain]

export const Terrain = {
  path: {
    id: 'path',
    name: 'path',
    char: 'path',
    color: '#262626',
    walkable: 'true',
  },
  wall: {
    id: 'wall',
    name: 'wall',
    char: 'wall',
    color: '#767676',

    blocksLight: 'true',
  },
  stairsDescending: {
    id: 'stairsDescending',
    name: 'descending stairs',
    char: 'stairsDescending',
    color: '#777',
    walkable: 'true',
    trodOn: "There's a staircase leading down here.",
  },
  stairsAscending: {
    id: 'stairsAscending',
    name: 'ascending stairs',
    char: 'stairsAscending',
    color: '#777',
    walkable: 'true',
    trodOn: "There's a staircase leading up here.",
  },
  crackedWall: {
    id: 'crackedWall',
    name: 'cracked wall',
    char: 'crackedWall',
    color: '#767676',

    blocksLight: 'true',
  },
  water: {
    id: 'water',
    name: 'water',
    char: 'water',
    color: '#4084bf',
    walkable: 'true',
    trodOn: 'You tread water.',
  },
  crackedPath1: {
    id: 'crackedPath1',
    name: 'cracked path',
    char: 'crackedPath1',
    color: '#262626',
    walkable: 'true',
  },
  crackedPath2: {
    id: 'crackedPath2',
    name: 'cracked path',
    char: 'crackedPath2',
    color: '#262626',
    walkable: 'true',
  },
  crackedPath3: {
    id: 'crackedPath3',
    name: 'cracked path',
    char: 'crackedPath3',
    color: '#262626',
    walkable: 'true',
  },
  crackedPath4: {
    id: 'crackedPath4',
    name: 'cracked path',
    char: 'crackedPath4',
    color: '#262626',
    walkable: 'true',
  },
  grass: {
    id: 'grass',
    name: 'grass',
    char: 'grass',
    color: '#65712b',
    walkable: 'true',
  },
  deadGrass: {
    id: 'deadGrass',
    name: 'dead grass',
    char: 'deadGrass',
    color: '#664f47',
    walkable: 'true',
  },
  shrub: {
    id: 'shrub',
    name: 'shrub',
    char: 'shrub',
    color: '#58a54a',
    walkable: 'true',
  },
  tree: {
    id: 'tree',
    name: 'tree',
    char: 'tree',
    color: 'forestgreen',
    walkable: 'true',
  },
  mound: {
    id: 'mound',
    name: 'mound',
    char: 'mound',
    color: '#6a4b39',
    walkable: 'true',

    trodOn: 'You round the mound.',
  },
  peak: {
    id: 'peak',
    name: 'peak',
    char: 'peak',
    color: '#2a5a3e',
    walkable: 'true',
    trodOn: 'You summit the peak.',
  },
  void: {
    id: 'void',
    name: 'void',
    char: 'void',
    color: '#F0F',
    walkable: 'true',
  },
  endlessVoid: {
    id: 'endlessVoid',
    name: 'endless void',
    char: 'void',
    color: '#F0F',

    blocksLight: 'true',
  },
}

export const TerrainLegacyMap: { [key: number]: Entity } = {
  0: hydrate(Terrain.path),
  1: hydrate(Terrain.wall),
  2: hydrate(Terrain.crackedWall),
  3: hydrate(Terrain.water),
  4: hydrate(Terrain.crackedPath1),
  5: hydrate(Terrain.crackedPath2),
  6: hydrate(Terrain.crackedPath3),
  7: hydrate(Terrain.crackedPath4),
  8: hydrate(Terrain.grass),
  9: hydrate(Terrain.deadGrass),
  10: hydrate(Terrain.stairsAscending),
  11: hydrate(Terrain.stairsDescending),
  12: hydrate(Terrain.tree),
  13: hydrate(Terrain.mound),
  14: hydrate(Terrain.peak),
  15: hydrate(Terrain.shrub),
  98: hydrate(Terrain.void),
  99: hydrate(Terrain.endlessVoid),
}

console.log(TerrainLegacyMap)
