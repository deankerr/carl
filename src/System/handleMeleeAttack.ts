import { Engine } from '../Core/Engine'

export const handleMeleeAttack = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting')
  if (!currentEntity) return
  const { acting: action } = currentEntity

  if (!('meleeAttack' in action)) return //log.msg('handleMeleeAttack: not a meleeAttack action')

  // get target
  const [targetEntity] = local.get('meleeAttackTarget')

  // hardcoded responses for now
  if (isPlayerTurn) {
    // kill target
    local.modify(targetEntity).define('tag', 'dead')
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
    local.modify(entity).remove('meleeAttackTarget')
  }
}
