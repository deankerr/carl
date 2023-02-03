import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

export const handleTread = (engine: Engine, isPlayerTurn: boolean) => {
  const log = logger('sys', 'handleTread')
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('tread' in action)) return //log.msg('handleTread: not a tread action')
  // Only the player
  if (!isPlayerTurn) {
    log.msg('handleTread: result - not the player')
    return
  }

  const entitiesHere = local.at(action.tread).filter(e => e !== currentEntity)
  for (const entity of entitiesHere) {
    if (entity.trodOn) {
      log.msg('handleTread: treading on', entity.label)
      engine.message(entity.trodOn.msg, entity)
    }
  }

  log.end('handleTread: done')
}
