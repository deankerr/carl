import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

// remove dead entities from game
export const processDeath = (engine: Engine) => {
  const log = logger('sys', 'processDeath')
  const { local } = engine
  const currentEntities = local.get('dead')

  if (currentEntities.length === 0) return

  for (const entity of currentEntities) {
    local.destroyEntity(entity)
  }
}
