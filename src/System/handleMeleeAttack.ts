import { Region } from '../Core/Region'

export const handleMeleeAttack = (region: Region, isPlayerTurn: boolean) => {
  const [currentEntity] = region.get('acting')
  const { acting: action } = currentEntity

  if (!('meleeAttack' in action)) return console.log('handleMeleeAttack: not a meleeAttack action')
  const { game } = window
  console.log('handleMeleeAttack: ', currentEntity.label)

  // get target
  const [targetEntity] = region.getTagged('meleeAttackTarget')

  // hardcoded responses for now
  if (isPlayerTurn) {
    // kill target
    console.log(`handleMeleeAttack: player killed ${targetEntity.label}`)
    region.addTag(targetEntity, 'dead')
    game.message(`You obliterate the ${targetEntity.form.name} with your mind!`)
  } else {
    // TODO in player vision/hearing range only
    game.message(`The ${currentEntity.form.name} glares helplessly at the ${targetEntity.form.name}`)
  }

  // ? cleanup
  const taggedEntities = region.getTagged('meleeAttackTarget')
  for (const entity of taggedEntities) {
    region.removeTag(entity, 'meleeAttackTarget')
    console.log(`handleMeleeAttack: cleanup - removed tagMeleeAttackTarget from ${entity.label}`)
  }
}
