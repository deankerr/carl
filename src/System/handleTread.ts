import { World } from '../Core/World'

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

  // ? treadable terrain?
  const entitiesHere = world.here(action.tread)[1].filter((e) => e !== currentEntity)

  if (entitiesHere.length === 0) {
    console.log('handleTread: result - there is nothing to tread on')
    return
  }

  for (const entity of entitiesHere) {
    const treaddable = world.with(entity, 'trodOn')
    if (treaddable) {
      console.log('handleTread: treading on', entity.id)
      world.message(treaddable.trodOn.message)
    }
  }

  console.log('handleTread: done')
}
