import { Entity, EntityKey, EntityWith } from '../Core'
import { Engine } from '../Core/Engine'
// import { logger } from '../lib/logger'

export function processTileUpdate(engine: Engine) {
  // const log = logger()
  const { local, options } = engine
  if (!options.formUpdate) return
  let changed = false
  // iterate through each entity with triggers, if a matching tag is found, update the entity's
  // form to the relevant set
  const setTriggers = local.get('tiles', 'tileTriggers')
  for (const entity of setTriggers) {
    const { render, tiles, tileTriggers } = entity
    tileTriggers.forEach((tag, tagIndex) => {
      if (tag in entity) {
        local.entity(entity).modify('render', tiles[tagIndex])
      }
      changed = true
    })
  }

  // find any cycle entity whose last update time has exceeded frequency, and update their form
  const autoCyclers = local.get('tiles', 'tilesAutoCycle')
  for (const entity of autoCyclers) {
    const { render, tiles, tilesAutoCycle: cycle } = entity
    if (Date.now() - cycle.lastUpdate > cycle.frequency) {
      const nextI = cycle.current + 1
      const i = nextI >= tiles.length ? 0 : nextI

      local
        .entity(entity)
        .modify('render', tiles[i])
        .modify('tilesAutoCycle', cycle.frequency, i, Date.now())
      changed = true
    }
  }

  // quick hack to animate terrain
  const tAnimators: EntityKey[] = ['water', 'waterFace']
  for (const key of tAnimators) {
    const terrain = local.pool.symbolic(key) as EntityWith<Entity, 'tiles' | 'tilesAutoCycle'>
    const { render, tiles, tilesAutoCycle: cycle } = terrain
    if (Date.now() - cycle.lastUpdate > cycle.frequency) {
      const nextI = cycle.current + 1
      const i = nextI >= tiles.length ? 0 : nextI

      terrain.render.char = tiles[i]
      terrain.tilesAutoCycle.current = i
      terrain.tilesAutoCycle.lastUpdate = Date.now()
      changed = true
    }

    if (changed) local.hasChanged = true
  }
}
