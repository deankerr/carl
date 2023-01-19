import { World } from '../Core/World'
import { tagMeleeAttackTarget, acting, tagWalkable, tagDoorOpen, tagLightPathUpdated } from '../Component'
import { MeleeAttack } from '../Action'

export const handleBump = (world: World) => {
  const [currentEntity] = world.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return console.log('handleBump: not a bump action')

  const [terrain, entities] = world.here(action.bump)
  const bumpableEntities = entities.filter(e => !('tagCurrentTurn' in e) && !('tagWalkable' in e))
  const currentIsPlayer = 'tagPlayer' in currentEntity

  if (bumpableEntities.length === 0) {
    // no entities, terrain bump
    console.log('handleBump: result - terrain bump')
    if (currentIsPlayer) world.message(`You bounce off the ${terrain.name}.`)
  } else {
    // entities
    console.log('handleBump: entity bump')

    // ? assuming there can only be one entity here
    const [bumpedEntity] = bumpableEntities
    if (currentIsPlayer) {
      // * handle door
      if ('tagDoor' in bumpedEntity) {
        console.log('handleBump: result - open door')
        world
          .modify(bumpedEntity)
          .add(tagWalkable())
          .add(tagDoorOpen())
          .add(tagLightPathUpdated())
          .remove('tagBlocksLight')

        world.message('You slowly push or pull the door open.')
        return
      }

      // * attack!
      world.modify(bumpedEntity).add(tagMeleeAttackTarget())

      // update acting component
      world.modify(currentEntity).change(acting(MeleeAttack(action.bump)))
      console.log(`handleBump: action - MeleeAttack ${bumpedEntity.id}`)
    }

    // * NPC attack something
    else {
      console.log('handleBump:', currentEntity.id, 'bumped', bumpedEntity.id)
      // TODO
    }
  }
}
