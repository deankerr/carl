import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

export const handleBump = (engine: Engine, isPlayerTurn: boolean) => {
  const log = logger('sys', 'handleBump')
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  const { acting: action } = currentEntity

  if (!('bump' in action)) return //log.msg('handleBump: not a bump action')

  const bumped = local.at(action.bump).filter(e => !e.acting && e.blocksMovement)

  if (bumped.some(e => e.terrain)) {
    log.msg('handleBump: result - terrain bump')
    if (isPlayerTurn) engine.message(`You bounce off the ${bumped[0].name}.`, bumped[0])
  } else {
    // entities
    log.msg('handleBump: entity bump')

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
          .modify('tag', 'signalLightPathUpdated')

        engine.message('Knock knock!!!', door)
        return log.end()
      }

      // * attack!
      local.entity(bumpedEntity).modify('tag', 'meleeAttackTarget')

      // update acting component
      // local.entity(currentEntity, component.acting(Action.MeleeAttack(action.bump)))
      local.entity(currentEntity).modify('acting', Action.MeleeAttack(action.bump))
      log.msg(`handleBump: action - MeleeAttack ${bumpedEntity.label}`)
    }

    // * NPC attack something
    else {
      log.msg('handleBump:', currentEntity.label, 'bumped', bumpedEntity.label)
      // TODO
    }
  }
  log.end()
}
