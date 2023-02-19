// import { Entity, EntityKey, EntityWith } from '../Core'
// import { Engine } from '../Core/Engine'
// import { pick, rnd } from '../lib/util'
// // import { logger } from '../lib/logger'

// export function processTileUpdate(engine: Engine) {
//   // const log = logger()
//   const { local, options } = engine
//   if (!options.formUpdate) return
//   let changed = false
//   // iterate through each entity with triggers, if a matching tag is found, update the entity's
//   // form to the relevant set
//   const setTriggers = local.get('tiles', 'tileTriggers', 'render')
//   for (const entity of setTriggers) {
//     const { tiles, tileTriggers } = entity
//     tileTriggers.forEach((tag, tagIndex) => {
//       if (tag in entity && entity.render.char !== tiles[tagIndex]) {
//         local.entity(entity).modify('render', tiles[tagIndex])
//         changed = true
//       }
//     })
//   }

//   // find any cycle entity whose last update time has exceeded frequency, and update their form
//   const autoCyclers = local.get('tiles', 'tilesAutoCycle')
//   for (const entity of autoCyclers) {
//     const { tiles, tilesAutoCycle: cycle } = entity
//     if (Date.now() - cycle.lastUpdate > cycle.frequency) {
//       const nextI = cycle.current + 1
//       const i = nextI >= tiles.length ? 0 : nextI

//       local
//         .entity(entity)
//         .modify('render', tiles[i])
//         .modify('tilesAutoCycle', cycle.frequency, i, Date.now())
//       changed = true
//     }
//   }

//   // terrain animation
//   for (const t of local.terrainMap.values()) {
//     if (t.render && t.tiles && t.tilesAutoCycle) {
//       if (Date.now() - t.tilesAutoCycle.lastUpdate > t.tilesAutoCycle.frequency) {
//         const nextI = t.tilesAutoCycle.current + 1
//         const i = nextI >= t.tiles.length ? 0 : nextI

//         t.render = {
//           char: t.tiles[i],
//           color: 'transparent',
//           bgColor: 'transparent',
//         }

//         t.tilesAutoCycle = {
//           ...t.tilesAutoCycle,
//           current: i,
//           lastUpdate: Date.now(),
//         }

//         changed = true
//       }
//     }

//     if (t.render && t.tiles && t.tilesAutoRandom) {
//       if (Date.now() - t.tilesAutoRandom.lastUpdate > t.tilesAutoRandom.frequency) {
//         const i = rnd(t.tiles.length - 1)
//         t.render = { ...t.render, char: t.tiles[i] }
//         t.tilesAutoRandom = { ...t.tilesAutoRandom, lastUpdate: Date.now() }
//         changed = true
//       }
//     }
//   }

//   // pick tiles
//   const pickTile = local.get('render', 'tiles', 'pickTile')
//   for (const entity of pickTile) {
//     const tile = !rnd(2) ? pick(entity.tiles) : entity.tiles[0]
//     local.entity(entity).modify('render', tile).remove('pickTile')
//     changed = true
//   }

//   const pickTileEqually = local.get('render', 'tiles', 'pickTileEqually')
//   for (const entity of pickTileEqually) {
//     local.entity(entity).modify('render', pick(entity.tiles)).remove('pickTileEqually')
//     changed = true
//   }

//   // pick appropriate corner tile based on walls around it
//   // assumed to default on "NW" corner tile
//   // tiles [NorthWest, NorthEast, SouthWest, SouthEast]
//   const pickTileCorner = local.get('render', 'tiles', 'pickTileCorner', 'position')
//   for (const entity of pickTileCorner) {
//     const pt = entity.position
//     const [north, east, south, west] = pt.neighbours4().map(npt => local.terrainAt(npt))

//     if (north.wall && west.wall) {
//       local.entity(entity).modify('render', entity.tiles[0]).remove('pickTileCorner')
//     } else if (north.wall && east.wall) {
//       local.entity(entity).modify('render', entity.tiles[1]).remove('pickTileCorner')
//     } else if (south.wall && west.wall) {
//       local.entity(entity).modify('render', entity.tiles[2]).remove('pickTileCorner')
//     } else if (south.wall && east.wall) {
//       local.entity(entity).modify('render', entity.tiles[3]).remove('pickTileCorner')
//     } else {
//       console.warn('pickTileCorner: Failed to determine appropriate tile', pt.s, entity)
//       local.entity(entity).remove('pickTileCorner')
//     }
//   }

//   if (changed) local.hasChanged = true
// }
