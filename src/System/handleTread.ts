import { Engine } from '../Core/Engine'

export const handleTread = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('tread' in action)) return console.log('handleTread: not a tread action')
  // Only the player
  if (!isPlayerTurn) {
    console.log('handleTread: result - not the player')
    return
  }

  const [terrainHere, entities] = local.at(action.tread)
  const entitiesHere = entities.filter(e => e !== currentEntity)

  if (entitiesHere.length > 0) {
    // entity tread
    for (const entity of entitiesHere) {
      if (entity.trodOn) {
        console.log('handleTread: treading on', entity.label)
        engine.message(entity.trodOn.msg + ' ' + currentEntity.label)
      }
    }
  } else if (terrainHere.trodOn) {
    engine.message(terrainHere.trodOn.msg + ' ' + currentEntity.label)
  }

  console.log('handleTread: done')
}
