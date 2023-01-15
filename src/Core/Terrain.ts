import { render, Graphic } from '../Component/Graphic'
import * as C from '../Component'
import { Entity } from './Entity'
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

// [name, char, color, walkable, transparent, trodOn?]
const templates = {
  path: ['path', 'O.', '#262626', 'true', 'true'],
  wall: ['wall', 'O.#', '#767676', 'false', 'false'],
  stairsDescending: ['descending stairs', 'O>', '#777', 'true', 'true', `There's a staircase leading down here.`],
  stairsAscending: ['ascending stairs', 'O<', '#777', 'true', 'true', `There's a staircase leading up here.`],
  crackedWall: ['cracked wall', 'O[', '#767676', 'false', 'false'],
  water: ['water', '~', '#76b8f1', 'true', 'true', 'You tread water.'],
  crackedPath1: ['cracked path', 'O.0', '#262626', 'true', 'true'],
  crackedPath2: ['cracked path', 'O.1', '#262626', 'true', 'true'],
  crackedPath3: ['cracked path', 'O.2', '#262626', 'true', 'true'],
  crackedPath4: ['cracked path', 'O.3', '#262626', 'true', 'true'],
  grass: ['grass', 'O"', '#65712b', 'true', 'true'],
  deadGrass: ['dead grass', 'O:', '#664f47', 'true', 'true'],
  shrub: ['shrub', 'Ov', '#58a54a', 'true', 'true'],
  tree: ['tree', 'OT', 'forestgreen', 'true', 'true'],
  mound: ['mound', 'OM', '#6a4b39', 'true', 'true'],
  peak: ['peak', 'OP', '#2a5a3e', 'true', 'true', 'You summit the peak.'],
  void: ['void', ' ', '#000', 'true', 'true'],
  endlessVoid: ['endless void', ' ', '#000', 'false', 'false'],
}

export const Terrain_NEW: Record<keyof typeof templates, Entity> = Object.entries(templates).reduce((acc, curr) => {
  const [key, template] = curr
  const entity: Entity = {
    id: template[0].replaceAll(' ', ''),
    ...C.description(template[0]),
    ...C.render({ base: { char: template[1], color: template[2] } }),
  }

  if (template[3] === 'true') entity.tagWalkable = true
  if (template[4] === 'true') entity.tagBlocksLight = true
  if (template[5]) entity.trodOn = C.trodOn(template[5]).trodOn

  return { ...acc, [key]: entity }
}, {}) as Record<keyof typeof templates, Entity>

console.log('TTTTTTTTTTT', Terrain_NEW)

export const TerrainLegacyMap: { [key: number]: Entity } = {
  0: Terrain_NEW.path,
  1: Terrain_NEW.wall,
  2: Terrain_NEW.crackedWall,
  3: Terrain_NEW.water,
  4: Terrain_NEW.crackedPath1,
  5: Terrain_NEW.crackedPath2,
  6: Terrain_NEW.crackedPath3,
  7: Terrain_NEW.crackedPath4,
  8: Terrain_NEW.grass,
  9: Terrain_NEW.deadGrass,
  10: Terrain_NEW.stairsAscending,
  11: Terrain_NEW.stairsDescending,
  12: Terrain_NEW.tree,
  13: Terrain_NEW.mound,
  14: Terrain_NEW.peak,
  15: Terrain_NEW.shrub,
  98: Terrain_NEW.void,
  99: Terrain_NEW.endlessVoid,
} as const
