import { render, Graphic } from '../Component/Graphic'
export type TerrainType = {
  title: string
  walkable: boolean
  transparent: boolean
  tread?: string
} & Graphic

export const Terrain: { [key: string]: TerrainType } = {
  path: {
    title: 'path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.', color: '#262626' },
    }),
  },
  wall: {
    title: 'wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O#', color: '#767676' },
    }),
  },
  stairsDescending: {
    title: 'descending stairs',
    walkable: true,
    transparent: true,
    tread: `There's a staircase leading down here.`,
    ...render({
      base: { char: 'O>', color: '#777' },
    }),
  },
  stairsAscending: {
    title: 'ascending stairs',
    walkable: true,
    transparent: true,
    tread: `There's a staircase leading up here.`,
    ...render({
      base: { char: 'O<', color: '#777' },
    }),
  },
  crackedWall: {
    title: 'cracked wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O[', color: '#767676' },
    }),
  },
  water: {
    title: 'water',
    walkable: true,
    transparent: true,
    tread: 'You tread water.',
    ...render({
      base: { char: '~', color: '#76b8f1' },
    }),
  },
  crackedPath1: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.0', color: '#262626' },
    }),
  },
  crackedPath2: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.1', color: '#262626' },
    }),
  },
  crackedPath3: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.2', color: '#262626' },
    }),
  },
  crackedPath4: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.3', color: '#262626' },
    }),
  },
  grass: {
    title: 'grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O"', color: '#65712b' },
    }),
  },
  deadGrass: {
    title: 'dead grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O:', color: '#664f47' },
    }),
  },
  shrub: {
    title: 'shrub',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'Ov', color: '#58a54a' },
    }),
  },
  tree: {
    title: 'tree',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'OT', color: 'forestgreen' },
    }),
  },
  mound: {
    title: 'mound',
    walkable: true,
    transparent: true,
    tread: 'You climb the mound.',
    ...render({
      base: { char: 'OM', color: '#6a4b39' },
    }),
  },
  peak: {
    title: 'peak',
    walkable: true,
    transparent: true,
    tread: 'You summit the peak.',
    ...render({
      base: { char: 'OP', color: '#2a5a3e' },
    }),
  },
  void: {
    title: 'void',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: ' ', color: '#000' },
    }),
  },
  endlessVoid: {
    // out of bounds terrain
    title: 'endless void',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: ' ', color: '#000' },
    }),
  },
}

export const TerrainNumMap: { [key: number]: TerrainType } = {
  0: Terrain.path,
  1: Terrain.wall,
  2: Terrain.crackedWall,
  3: Terrain.water,
  4: Terrain.crackedPath1,
  5: Terrain.crackedPath2,
  6: Terrain.crackedPath3,
  7: Terrain.crackedPath4,
  8: Terrain.grass,
  9: Terrain.deadGrass,
  10: Terrain.stairsAscending,
  11: Terrain.stairsDescending,
  12: Terrain.tree,
  13: Terrain.mound,
  14: Terrain.peak,
  15: Terrain.shrub,
  98: Terrain.void,
  99: Terrain.endlessVoid,
}
