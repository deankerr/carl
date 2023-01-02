// remove dead entities from game
// TODO handle non "beings" ie items
import { World } from '../Core/World'

export const processDeath = (world: World) => {
  const currentEntities = world.get('tagDead')

  if (currentEntities.length === 0) return console.log('processDeath: no entities to remove')

  console.warn('processDeath: I should do something')
  for (const entity of currentEntities) {
    console.log('processDeath: removing', entity.id)
    world.remove(entity)
    console.log('processDeath: removed', entity.id)
  }

  console.log('processDeath: process complete')
}