export {}
// import * as C from '../Component'
// import { Entity } from './Entity'

// // [name, char, color, walkable, transparent, trodOn?]
// export const terrainTemplates = {
//   path: ['path', 'O.', '#262626', 'true', 'true'],
//   wall: ['wall', 'O#', '#767676', 'false', 'false'],
//   stairsDescending: ['descending stairs', 'O>', '#777', 'true', 'true', `There's a staircase leading down here.`],
//   stairsAscending: ['ascending stairs', 'O<', '#777', 'true', 'true', `There's a staircase leading up here.`],
//   crackedWall: ['cracked wall', 'O[', '#767676', 'false', 'false'],
//   water: ['water', '~', '#4084bf', 'true', 'true', 'You tread water.'],
//   crackedPath1: ['cracked path', 'O.0', '#262626', 'true', 'true'],
//   crackedPath2: ['cracked path', 'O.1', '#262626', 'true', 'true'],
//   crackedPath3: ['cracked path', 'O.2', '#262626', 'true', 'true'],
//   crackedPath4: ['cracked path', 'O.3', '#262626', 'true', 'true'],
//   grass: ['grass', 'O"', '#65712b', 'true', 'true'],
//   deadGrass: ['dead grass', 'O:', '#664f47', 'true', 'true'],
//   shrub: ['shrub', 'shrub', '#58a54a', 'true', 'true'],
//   tree: ['tree', 'OT', 'forestgreen', 'true', 'true'],
//   mound: ['mound', 'OM', '#6a4b39', 'true', 'true', 'You round the mound.'],
//   peak: ['peak', 'OP', '#2a5a3e', 'true', 'true', 'You summit the peak.'],
//   void: ['void', ' ', '#000', 'true', 'true'],
//   endlessVoid: ['endless void', ' ', '#000', 'false', 'false'],
// }

// export const Terrain: Record<keyof typeof terrainTemplates, Entity> = Object.entries(terrainTemplates).reduce(
//   (acc, curr) => {
//     const [key, template] = curr
//     const entity: Entity = {
//       id: template[0].replaceAll(' ', ''),
//       ...C.name(template[0]),
//       ...C.baseGraphic(template[1], template[2]),
//     }

//     if (template[3] === 'true') entity.tagWalkable = true
//     if (template[4] === 'false') entity.tagBlocksLight = true
//     if (template[5]) entity.trodOn = C.trodOn(template[5]).trodOn

//     return { ...acc, [key]: entity }
//   },
//   {}
// ) as Record<keyof typeof terrainTemplates, Entity>

// export const TerrainLegacyMap: { [key: number]: Entity } = {
//   0: Terrain.path,
//   1: Terrain.wall,
//   2: Terrain.crackedWall,
//   3: Terrain.water,
//   4: Terrain.crackedPath1,
//   5: Terrain.crackedPath2,
//   6: Terrain.crackedPath3,
//   7: Terrain.crackedPath4,
//   8: Terrain.grass,
//   9: Terrain.deadGrass,
//   10: Terrain.stairsAscending,
//   11: Terrain.stairsDescending,
//   12: Terrain.tree,
//   13: Terrain.mound,
//   14: Terrain.peak,
//   15: Terrain.shrub,
//   98: Terrain.void,
//   99: Terrain.endlessVoid,
// } as const
