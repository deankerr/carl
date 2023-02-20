import { Engine } from '../Core/Engine'

export const handleTread = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  if (!currentEntity) return
  const { acting: action } = currentEntity

  if (!('tread' in action)) return //log.msg('handleTread: not a tread action')
  // Only the player
  if (!isPlayerTurn) {
    return
  }

  const entitiesHere = local.at(action.tread).filter(e => e !== currentEntity)
  for (const entity of entitiesHere) {
    if (entity.trodOn) {
      engine.message(entity.trodOn.msg, entity)
    }
  }

  // item here
  const items = entitiesHere.filter(e => e.item)
  for (const item of items) {
    engine.message(`There is a ${item.name} lying here.`, item)
  }
}
