import { Region } from '../Core/Region'

export const handleTread = (region: Region, isPlayerTurn: boolean) => {
  const [currentEntity] = region.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('tread' in action)) return console.log('handleTread: not a tread action')
  // Only the player
  if (isPlayerTurn) {
    console.log('handleTread: result - not the player')
    return
  }

  const [terrainHere, entities] = region.at(action.tread)
  const entitiesHere = entities.filter(e => e !== currentEntity)

  if (entitiesHere.length > 0) {
    // entity tread
    for (const entity of entitiesHere) {
      if ('trodOn' in entity && entity.trodOn) {
        console.log('handleTread: treading on', entity.label)
        window.game.message(entity.trodOn.msg)
      }
    }
  } else if (terrainHere.trodOn) {
    console.log('tread: terrain msg?')
    window.game.message(terrainHere.trodOn.msg)
  }

  console.log('handleTread: done')
}
