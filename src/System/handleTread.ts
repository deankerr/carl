import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

export const handleTread = (engine: Engine, isPlayerTurn: boolean) => {
  const log = logger('sys', 'handleTread')
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  if (!currentEntity) return
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

  // item here
  const items = entitiesHere.filter(e => e.item)
  for (const item of items) {
    engine.message(`There is a ${item.name} lying here.`, item)
  }

  log.end('handleTread: done')
}
