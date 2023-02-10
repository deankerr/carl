// import { Entity, EntityKey, EntityWith } from '../Core'
import { Engine } from '../Core/Engine'
// // import { logger } from '../lib/logger'

export function processFormUpdate(engine: Engine) {
  return
}
//   // const log = logger()
//   const { local, options } = engine
//   if (!options.formUpdate) return
//   let changed = false
//   // iterate through each entity with triggers, if a matching tag is found, update the entity's
//   // form to the relevant set
//   const setTriggers = local.get('tiles', 'tileTriggers')
//   for (const entity of setTriggers) {
//     const { render, tiles, tileTriggers } = entity
//     tileTriggers.forEach((tag, tagIndex) => {
//       if (tag in entity) {
//         const i = tagIndex * 3

//         const newForm = [
//           tiles[i] === '' ? tile.char : tiles[i],
//           tiles[i + 1] === '' ? tile.color : tiles[i + 1],
//           tiles[i + 2] === '' ? tile.bgColor : tiles[i + 2],
//         ] as [string, string, string]

//         local.entity(entity).modify('tile', ...newForm)
//       }
//       changed = true
//     })
//   }

//   // find any cycle entity whose last update time has exceeded frequency, and update their form
//   const autoCyclers = local.get('tiles', 'tilesAutoCycle')
//   for (const entity of autoCyclers) {
//     const { tile, tiles, tilesAutoCycle: cycle } = entity
//     if (Date.now() - cycle.lastUpdate > cycle.frequency) {
//       const nextI = cycle.current + 3
//       const i = nextI >= tiles.length ? 0 : nextI

//       const newForm = [
//         tiles[i] === '' ? tile.char : tiles[i],
//         tiles[i + 1] === '' ? tile.color : tiles[i + 1],
//         tiles[i + 2] === '' ? tile.bgColor : tiles[i + 2],
//       ] as [string, string, string]

//       local
//         .entity(entity)
//         .modify('tile', ...newForm)
//         .modify('tilesAutoCycle', cycle.frequency, i, Date.now())
//       changed = true
//     }
//   }

//   // quick hack to animate terrain
//   const tAnimators: EntityKey[] = ['water', 'waterFace']
//   for (const key of tAnimators) {
//     const terrain = local.pool.symbolic(key) as EntityWith<Entity, 'tiles' | 'tilesAutoCycle'>
//     const { tile, tiles, tilesAutoCycle: cycle } = terrain
//     if (Date.now() - cycle.lastUpdate > cycle.frequency) {
//       const nextI = cycle.current + 3
//       const i = nextI >= tiles.length ? 0 : nextI

//       const newForm = [
//         tiles[i] === '' ? tile.char : tiles[i],
//         tiles[i + 1] === '' ? tile.color : tiles[i + 1],
//         tiles[i + 2] === '' ? tile.bgColor : tiles[i + 2],
//       ] as [string, string, string]

//       terrain.tile.char = tiles[i]
//       terrain.tilesAutoCycle.current = i
//       terrain.tilesAutoCycle.lastUpdate = Date.now()
//       changed = true
//     }

//     if (changed) local.hasChanged = true
//   }
// }
