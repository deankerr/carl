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
      base: { char: 'O.', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  wall: {
    title: 'wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O#', color: '#777' },
      seen: { color: '#555' },
    }),
  },
  stairsDescending: {
    title: 'descending stairs',
    walkable: true,
    transparent: true,
    tread: `There's a staircase leading down here.`,
    ...render({
      base: { char: 'O>', color: '#777' },
      seen: { color: '#555' },
    }),
  },
  stairsAscending: {
    title: 'ascending stairs',
    walkable: true,
    transparent: true,
    tread: `There's a staircase leading up here.`,
    ...render({
      base: { char: 'O<', color: '#777' },
      seen: { color: '#555' },
    }),
  },
  crackedWall: {
    title: 'cracked wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O[', color: '#666' },
      seen: { color: '#555' },
    }),
  },
  water: {
    title: 'water',
    walkable: true,
    transparent: true,
    tread: 'You splash through the water.',
    ...render({
      base: { char: '~', color: 'deepskyblue' },
      seen: { color: 'darkcyan' },
    }),
  },
  crackedPath1: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.0', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  crackedPath2: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.1', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  crackedPath3: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.2', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  crackedPath4: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.3', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  grass: {
    title: 'grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O"', color: 'green' },
      seen: { color: 'darkgreen' },
    }),
  },
  deadGrass: {
    title: 'dead grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O:', color: '#5f574f' },
      seen: { color: '#5f574f' },
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
  98: Terrain.void,
  99: Terrain.endlessVoid,
}
