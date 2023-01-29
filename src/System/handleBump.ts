// import { tagMeleeAttackTarget, acting, tagWalkable, tagDoorOpen, tagLightPathUpdated } from '../Component'
import * as Action from '../Action'
import { Region } from '../Core/Region'

export const handleBump = (region: Region, isPlayerTurn: boolean) => {
  const [currentEntity] = region.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return console.log('handleBump: not a bump action')

  const { message, component } = window.game
  const [terrain, entities] = region.at(action.bump)
  const bumpableEntities = entities.filter(e => !('tagCurrentTurn' in e) && !('tagWalkable' in e))

  if (bumpableEntities.length === 0) {
    // no entities, terrain bump
    console.log('handleBump: result - terrain bump')
    if (isPlayerTurn) message(`You bounce off the ${terrain.form.name}.`)
  } else {
    // entities
    console.log('handleBump: entity bump')

    // ? assuming there can only be one entity here
    const [bumpedEntity] = bumpableEntities
    if (isPlayerTurn) {
      // * handle door
      // const door = world.with(bumpedEntity, 'doorGraphic')
      // if (door) {
      //   console.log('handleBump: result - open door')
      //   const door = world.with(bumpedEntity, 'doorGraphic')
      //   if (door)
      //     world
      //       .modify(bumpedEntity)
      //       .add(tagWalkable())
      //       .add(tagDoorOpen())
      //       .add(tagLightPathUpdated())
      //       .change(door.doorGraphic.open)
      //       .remove('tagBlocksLight')

      //   world.message('You slowly push or pull the door open.')
      //   return
      // }

      // * attack!
      // region.modify(bumpedEntity).add(tagMeleeAttackTarget())
      region.addTag(bumpedEntity, 'meleeAttackTarget')

      // update acting component
      region.modify(currentEntity, component.acting(Action.MeleeAttack(action.bump)))
      console.log(`handleBump: action - MeleeAttack ${bumpedEntity.label}`)
    }

    // * NPC attack something
    else {
      console.log('handleBump:', currentEntity.label, 'bumped', bumpedEntity.label)
      // TODO
    }
  }
}
