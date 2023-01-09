import { World } from '../Core/World'
import { door, tagMeleeAttackTarget, acting, tagWalkable } from '../Component'
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
    if (currentIsPlayer) world.message(`You bounce off the ${terrain.title}.`)
  } else {
    // entities
    console.log('handleBump: entity bump')
    // TODO Let NPCs do things
    // ? assuming there can only be one entity here
    const [bumpedEntity] = bumpableEntities
    if (currentIsPlayer) {
      // * handle door
      const doorEntity = world.with(bumpedEntity, 'door')
      if (doorEntity) {
        console.log('handleBump: result - open door')
        world.entityManage(doorEntity).add(tagWalkable()).change(door(true)).remove('tagBlocksLight')

        world.message('Your hands tremble as you slowly push or pull the door open.')
        return
      }

      // * attack!
      const newTag = tagMeleeAttackTarget()
      world.addComponent(bumpedEntity, newTag)

      // update acting component
      const newActing = acting(MeleeAttack(action.bump))
      world.updateComponent(currentEntity, newActing)
      console.log(`handleBump: action - MeleeAttack ${bumpedEntity.id}`)
    }

    // * NPC attack something
    else {
      console.log('handleBump:', currentEntity.id, 'bumped', bumpedEntity.id)
      // TODO
    }
  }
}
