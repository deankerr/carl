// import { tagMeleeAttackTarget, acting, tagWalkable, tagDoorOpen, tagLightPathUpdated } from '../Component'
import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const handleBump = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return console.log('handleBump: not a bump action')

  const bumped = local.at(action.bump).filter(e => !e.acting && e.blocksMovement)

  if (bumped.some(e => e.terrain)) {
    console.log('handleBump: result - terrain bump')
    if (isPlayerTurn) engine.message(`You bounce off the ${bumped[0].name}.`)
  } else {
    // entities
    console.log('handleBump: entity bump')

    // ? assuming there can only be one entity here
    const [bumpedEntity] = bumped
    if (isPlayerTurn) {
      // * handle door
      const door = local.has(bumpedEntity, 'isClosed', 'formSet', 'formSetTriggers')
      if (door) {
        local
          .entity(door)
          .remove('isClosed')
          .remove('blocksLight')
          .remove('blocksMovement')
          .modify('tag', 'isOpen')

        engine.message('Knock knock!!!')
        return
      }

      // * attack!
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
