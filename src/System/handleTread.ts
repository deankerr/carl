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

  const entitiesHere = local.at(action.tread).filter(e => e !== currentEntity)
  for (const entity of entitiesHere) {
    if (entity.trodOn) {
      console.log('handleTread: treading on', entity.label)
      engine.message(entity.trodOn.msg)
    }
  }

  console.log('handleTread: done')
}
