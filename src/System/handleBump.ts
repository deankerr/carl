import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const handleBump = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  if (!currentEntity) return
  const { acting: action } = currentEntity

  if (!('bump' in action)) return //log.msg('handleBump: not a bump action')

  const bumped = local.at(action.bump).filter(e => !e.acting && e.blocksMovement)

  if (bumped.some(e => e.terrain)) {
    if (isPlayerTurn) engine.message(`You bounce off the ${bumped[0].name}.`, bumped[0])
  } else {
    // entities
    // ? assuming there can only be one entity here
    const [eBumped] = bumped
    // TODO non-player bump reactions
    if (isPlayerTurn) {
      // * handle door
      const door = local.has(eBumped, 'isClosed')
      if (door) {
        local
          .modify(door)
          .remove('isClosed')
          .remove('blocksLight')
          .remove('blocksMovement')
          .define('tag', 'isOpen')
          .define('tag', 'signalLightPathUpdated')

        if (door.isVertical) {
          const [doorNorth] = local.at(action.bump.add(0, -1)).filter(e => e.door)
          local
            .modify(doorNorth)
            .remove('isClosed')
            .remove('blocksLight')
            .remove('blocksMovement')
            .define('tag', 'isOpen')
            .define('tag', 'signalLightPathUpdated')
        }

        engine.message('Knock knock!!!', door)
      }

      // * hostile - attack
      if (eBumped.hostile) {
        local.modify(eBumped).define('tag', 'meleeAttackTarget')

        // update acting component
        local.modify(currentEntity).define('acting', Action.MeleeAttack(action.bump))
      }

      // * friendly msg
      else if (eBumped.friendly && eBumped.bumpMessage) {
        engine.message(eBumped.name + ': ' + eBumped.bumpMessage.msg, eBumped)
      }

      // * generic bump msg
      else {
        engine.message(`You bounce off the ${eBumped.name}.`, eBumped)
      }
    }
  }
}
