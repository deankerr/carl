import { World } from '../Core/World'
import { tagMeleeAttackTarget, acting } from '../Core/Components'
import { MeleeAttack } from '../Action'

export const handleBump = (world: World) => {
  const [currentEntity] = world.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return console.log('handleBump: not a bump action')

  const [terrain, entities] = world.here(action.bump)
  const currentIsPlayer = 'tagPlayer' in currentEntity

  if (entities.length === 0) {
    // no entities, terrain bump
    console.log('handleBump: result - terrain bump')
    if (currentIsPlayer) world.message(`You bounce off the ${terrain.title}.`)
  } else {
    // entities
    console.log('handleBump: entity bump')
    // TODO handle walkable/items etc
    // ? assuming there can only be one entity here
    // * Player attack NPC:
    const [blockingEntity] = entities
    if (currentIsPlayer) {
      world.message(`You walk straight into the ${blockingEntity.id}...`)

      // attach component to target
      const newTag = tagMeleeAttackTarget()
      world.addComponent(blockingEntity, newTag)

      // update acting component
      const newActing = acting(MeleeAttack(action.bump))
      world.updateComponent(currentEntity, newActing)
      console.log(`handleBump: action - MeleeAttack ${blockingEntity.id}`)
    }

    // * NPC attack something
    else {
      // TODO
    }
  }
}
