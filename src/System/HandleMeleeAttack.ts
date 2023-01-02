import { dead } from '../Core/Components'
import { World } from '../Core/World'

export const handleMeleeAttack = (world: World) => {
  const [currentEntity] = world.get('acting')
  const { acting: action } = currentEntity

  if (!action) return console.log('handleMeleeAttack: null action')
  if (!('meleeAttack' in action)) return console.log('handleMeleeAttack: not a meleeAttack action')

  console.warn('handleMeleeAttack: I should do something')

  // get target
  const [targetEntity] = world.get('tagMeleeAttackTarget')
  const currentIsPlayer = 'tagPlayer' in currentEntity
  const targetIsPlayer = 'tagPlayer' in targetEntity

  // hardcoded responses for now
  if (currentIsPlayer && targetIsPlayer) {
    throw new Error('Player is attacking player, this should not happen')
  } else if (currentIsPlayer) {
    // kill target
    console.log(`handleMeleeAttack: player killed ${targetEntity.id}`)
    const newDead = dead()
    world.addComponent(targetEntity, newDead)
    world.message(`You obliterate the ${targetEntity.id} with your mind!`)
  } else {
    // TODO in player vision/hearing range only
    world.message(`The ${currentEntity.id} glares helplessly at the ${targetEntity.id}`)
  }

  // ? cleanup
  const taggedEntities = world.get('tagMeleeAttackTarget')
  for (const entity of taggedEntities) {
    world.removeComponent(entity, 'tagMeleeAttackTarget')
    console.log(`handleMeleeAttack: cleanup - removed tagMeleeAttackTarget from ${entity.id}`)
  }
}
