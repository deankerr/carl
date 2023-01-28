import * as ROT from 'rot-js'
import { Color } from 'rot-js/lib/color'
import * as C from '../Component'
import { Entity, hydrate } from '../Core/Entity'
export type TerrainTemplate = typeof Terrain[keyof typeof Terrain]

export const Terrain = {
  path: {
    id: 'path',
    name: 'path',
    char: 'path',
    color: '#262626',
    tag: ['walkable'],
  },
  wall: {
    id: 'wall',
    name: 'wall',
    char: 'wall',
    color: '#767676',
    tag: ['blocksLight'],
  },
  stairsDescending: {
    id: 'stairsDescending',
    name: 'descending stairs',
    char: 'stairsDescending',
    color: '#777',
    tag: ['walkable'],
    trodOn: "There's a staircase leading down here.",
  },
  stairsAscending: {
    id: 'stairsAscending',
    name: 'ascending stairs',
    char: 'stairsAscending',
    color: '#777',
    tag: ['walkable'],
    trodOn: "There's a staircase leading up here.",
  },
  crackedWall: {
    id: 'crackedWall',
    name: 'cracked wall',
    char: 'crackedWall',
    color: '#767676',
    tag: ['blocksLight'],
  },
  water: {
    id: 'water',
    name: 'water',
    char: 'water',
    color: '#4084bf',
    tag: ['walkable'],
    trodOn: 'You tread water.',
  },
  crackedPath1: {
    id: 'crackedPath1',
    name: 'cracked path',
    char: 'crackedPath1',
    color: '#262626',
    tag: ['walkable'],
  },
  crackedPath2: {
    id: 'crackedPath2',
    name: 'cracked path',
    char: 'crackedPath2',
    color: '#262626',
    tag: ['walkable'],
  },
  crackedPath3: {
    id: 'crackedPath3',
    name: 'cracked path',
    char: 'crackedPath3',
    color: '#262626',
    tag: ['walkable'],
  },
  crackedPath4: {
    id: 'crackedPath4',
    name: 'cracked path',
    char: 'crackedPath4',
    color: '#262626',
    tag: ['walkable'],
  },
  grass: {
    id: 'grass',
    name: 'grass',
    char: 'grass',
    color: '#65712b',
    tag: ['walkable'],
  },
  deadGrass: {
    id: 'deadGrass',
    name: 'dead grass',
    char: 'deadGrass',
    color: '#664f47',
    tag: ['walkable'],
  },
  mound: {
    id: 'mound',
    name: 'mound',
    char: 'mound',
    color: '#6a4b39',
    tag: ['walkable', 'blocksLight'],
    trodOn: 'You round the mound.',
  },
  peak: {
    id: 'peak',
    name: 'peak',
    char: 'peak',
    color: '#2a5a3e',
    tag: ['walkable', 'blocksLight'],
    trodOn: 'You summit the peak.',
  },
  // tombstone: {
  //   id: 'tombstone',
  //   name: 'tombstone',
  //   char: 'tombstone',
  //   color: '#767676',
  //   tag: ['walkable'],
  //   trodOn: 'You bow your head solemnly in thoughtful prayer.',
  // },

  smallCheck: {
    id: 'smallCheck',
    name: 'small checkerboard',
    char: 'smallCheck',
    color: '#C8757B',
    tag: ['walkable'],
  },
  pip: {
    id: 'pip',
    name: 'pip',
    char: 'bigCheck',
    color: '#C8757B',
    tag: ['walkable'],
  },
  void: {
    id: 'void',
    name: 'void',
    char: 'void',
    color: '#000',
    tag: ['walkable'],
  },
  endlessVoid: {
    id: 'endlessVoid',
    name: 'endless void',
    char: 'void',
    color: '#F0F',
    tag: ['blocksLight'],
  },
}

export const GlobalTerrainData = new Map<TerrainTemplate, Entity>()
Object.entries(Terrain).forEach(t => GlobalTerrainData.set(t[1], hydrate(t[1])))

export function GlobalTerrain(template: TerrainTemplate) {
  const tEntity = GlobalTerrainData.get(template)
  return tEntity ?? hydrate(Terrain.endlessVoid)
}

let markerCount = 0
export function Marker() {
  // const h = markerCount % 2 ? (markerCount++ % 20) * 0.05 : (markerCount++ % 20) * 0.05 + 0.4
  const h = (markerCount++ % 20) * 0.06
  const hslc = [h, 0.5, 0.5] as Color
  const rgb = ROT.Color.hsl2rgb(hslc)
  // console.log('Marker:', hslc, rgb)
  return { ...Terrain.pip, color: ROT.Color.toHex(rgb) }
}

export const terraindef = [
  { id: 'path', name: 'path', char: 'path', color: '#262626', tags: ['walkable'] },
  { id: 'wall', name: 'wall', char: 'wall', color: '#767676', tags: ['blocksLight'] },
  { id: 'stairsDown', name: 'stairs downward', char: 'stairsDown', color: '#777', tags: ['walkable'] },
  { id: 'stairsUp', name: 'stairs upward', char: 'stairsUp', color: '#777', tags: ['walkable'] },
  { id: 'crackedWall', name: 'cracked wall', char: 'crackedWall', color: '#', tags: [''] },
  { id: 'water', name: 'water', char: 'water', color: '#4084bf', tags: ['walkable'] },
  { id: 'grass', name: 'grass', char: 'grass', color: '#65712b', tags: ['walkable'] },
  { id: 'deadGrass ', name: 'dead grass', char: 'deadGrass', color: '#664f47', tags: ['walkable'] },
  { id: 'mound', name: 'mound', char: 'mound', color: '#6a4b39', tags: ['walkable', 'blocksLight'] },
  { id: 'peak', name: 'peak', char: 'peak', color: '#2a5a3e', tags: ['walkable', 'blocksLight'] },
  { id: 'void', name: 'void', char: 'void', color: '#000000', tags: ['walkable'] },
  { id: 'endlessVoid', name: 'endless void', char: 'void', color: '#FF00FF', tags: ['blocksLight'] },
]

// const t2 = terraindef.reduce((acc, curr) => {

// }, {})

type EntDef = {
  id: string
  name: string
  char: string
  color: string
  tags: string[]
}

export function createGlobalEntities(...defs: EntDef[]) {
  const a = defs.reduce((acc, curr) => {
    let e = {
      id: curr.id,
      name: curr.name,
      char: curr.char,
      color: curr.color,
    }

    if ('tags' in curr) {
      if (curr.tags.includes('walkable')) e = { ...e, ...C.tagWalkable() }
      if (curr.tags.includes('blocksLight')) e = { ...e, ...C.tagBlocksLight() }
    }

    return { ...acc, e }
  }, {})
  return a
}
