import { Engine } from '../Core/Engine'

export const handleMeleeAttack = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting')
  const { acting: action } = currentEntity

  if (!('meleeAttack' in action)) return console.log('handleMeleeAttack: not a meleeAttack action')

  console.log('handleMeleeAttack: ', currentEntity.label)

  // get target
  const [targetEntity] = local.get('meleeAttackTarget')

  // hardcoded responses for now
  if (isPlayerTurn) {
    // kill target
    console.log(`handleMeleeAttack: player killed ${targetEntity.label}`)
    local.entity(targetEntity).modify('tag', 'dead')
    engine.message(`You obliterate the ${targetEntity.name} with your mind!`)
  } else {
    // TODO in player vision/hearing range only
    engine.message(`The ${currentEntity.name} glares helplessly at the ${targetEntity.name}`)
  }

  // ? cleanup
  const taggedEntities = local.get('meleeAttackTarget')
  for (const entity of taggedEntities) {
    local.entity(entity).remove('meleeAttackTarget')
    console.log(`handleMeleeAttack: cleanup - removed tagMeleeAttackTarget from ${entity.label}`)
  }
}
