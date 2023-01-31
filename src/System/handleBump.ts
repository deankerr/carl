// import { tagMeleeAttackTarget, acting, tagWalkable, tagDoorOpen, tagLightPathUpdated } from '../Component'
import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const handleBump = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return console.log('handleBump: not a bump action')

  const [terrain, entities] = local.at(action.bump)
  const bumpableEntities = entities.filter(e => !('tagCurrentTurn' in e) && !('tagWalkable' in e))

  if (bumpableEntities.length === 0) {
    // no entities, terrain bump
    console.log('handleBump: result - terrain bump')
    if (isPlayerTurn) engine.message(`You bounce off the ${terrain.name}.`)
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
      // local.modify(bumpedEntity).add(tagMeleeAttackTarget())
      // local.addTag(bumpedEntity, 'meleeAttackTarget')
      local.entity(bumpedEntity).modify('tag', 'meleeAttackTarget')

      // update acting component
      // local.entity(currentEntity, component.acting(Action.MeleeAttack(action.bump)))
      local.entity(currentEntity).modify('acting', Action.MeleeAttack(action.bump))
      console.log(`handleBump: action - MeleeAttack ${bumpedEntity.label}`)
    }

    // * NPC attack something
    else {
      console.log('handleBump:', currentEntity.label, 'bumped', bumpedEntity.label)
      // TODO
    }
  }
}
