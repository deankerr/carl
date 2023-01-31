import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

// remove dead entities from game
export const processDeath = (engine: Engine) => {
  const log = logger('sys', 'processDeath')
  const { local } = engine
  const currentEntities = local.get('dead')

  if (currentEntities.length === 0) return log.msg('processDeath: no entities to remove')

  log.msg('processDeath: reaping')
  for (const entity of currentEntities) {
    log.msg('processDeath: removing', entity.label)
    local.destroy(entity)
    log.msg('processDeath: removed', entity.label)
  }

  log.msg('processDeath: process complete')
}
