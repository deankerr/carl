import { World } from '../../dev-assets/graveyard/ECS/Template/World'

export const handleTread = (world: World) => {
  const [currentEntity] = world.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('tread' in action)) return console.log('handleTread: not a tread action')

  // Only the player
  const currentIsPlayer = 'tagPlayer' in currentEntity
  if (!currentIsPlayer) {
    console.log('handleTread: result - not the player')
    return
  }

  const [terrainHere, entities] = world.here(action.tread)
  const entitiesHere = entities.filter(e => e !== currentEntity)

  if (entitiesHere.length > 0) {
    // entity tread
    for (const entity of entitiesHere) {
      const treaddable = world.with(entity, 'trodOn')
      if (treaddable) {
        console.log('handleTread: treading on', entity.id)
        world.message(treaddable.trodOn.message)
      }
    }
  } else if (terrainHere.trodOn) {
    world.message(terrainHere.trodOn.message)
  }

  console.log('handleTread: done')
}
