import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

export const handleMeleeAttack = (engine: Engine, isPlayerTurn: boolean) => {
  const log = logger('sys', 'handleMeleeAttack')
  const { local } = engine
  const [currentEntity] = local.get('acting')
  const { acting: action } = currentEntity

  if (!('meleeAttack' in action)) return //log.msg('handleMeleeAttack: not a meleeAttack action')

  log.msg('handleMeleeAttack: ', currentEntity.label)

  // get target
  const [targetEntity] = local.get('meleeAttackTarget')

  // hardcoded responses for now
  if (isPlayerTurn) {
    // kill target
    log.msg(`handleMeleeAttack: player killed ${targetEntity.label}`)
    local.entity(targetEntity).modify('tag', 'dead')
    engine.message(`You obliterate the ${targetEntity.name} with your mind!`, targetEntity)
  } else {
    // TODO in player vision/hearing range only
    engine.message(
      `The ${currentEntity.name} glares helplessly at the ${targetEntity.name}`,
      targetEntity
    )
  }

  // ? cleanup
  const taggedEntities = local.get('meleeAttackTarget')
  for (const entity of taggedEntities) {
    local.entity(entity).remove('meleeAttackTarget')
    log.msg(`handleMeleeAttack: cleanup - removed tagMeleeAttackTarget from ${entity.label}`)
  }
}
