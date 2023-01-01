import { World } from '../Core/World'
import { Pt } from '../Model/Point'

export function handleBump(world: World) {
  const [entity] = world.get('acting', 'position')
  const { acting: action } = entity

  if (!action) return console.log('Bump: null action')
  if (!('bump' in action)) return console.log('Bump: not a bump action')

  const [terrain, entities] = world.here(Pt(action.bump.x, action.bump.y))
  const isPlayer = 'tagPlayer' in entity

  if (entities.length === 0) {
    // no entities, terrain bump
    if (isPlayer) world.message(`You bounce off the ${terrain.title}.`)
  } else {
    // entities
    // TODO handle walkable
    if (isPlayer) world.message(`You walk straight into the ${entities[0].id}.`)
  }
}
