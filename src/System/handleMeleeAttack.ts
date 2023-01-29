// import { dead } from '../Component'
// import { World } from '../../dev-assets/graveyard/ECS/Template/World'

// export const handleMeleeAttack = (world: World) => {
//   const [currentEntity] = world.get('acting')
//   const { acting: action } = currentEntity

//   if (!('meleeAttack' in action)) return console.log('handleMeleeAttack: not a meleeAttack action')

//   console.log('handleMeleeAttack: ', currentEntity.id)

//   // get target
//   const [targetEntity] = world.get('tagMeleeAttackTarget')
//   const currentIsPlayer = 'tagPlayer' in currentEntity
//   const targetIsPlayer = 'tagPlayer' in targetEntity

//   // hardcoded responses for now
//   if (currentIsPlayer && targetIsPlayer) {
//     throw new Error('Player is attacking player, this should not happen')
//   } else if (currentIsPlayer) {
//     // kill target
//     console.log(`handleMeleeAttack: player killed ${targetEntity.id}`)
//     world.modify(targetEntity).add(dead())
//     world.message(`You obliterate the ${targetEntity.name} with your mind!`)
//   } else {
//     // TODO in player vision/hearing range only
//     world.message(`The ${currentEntity.name} glares helplessly at the ${targetEntity.id}`)
//   }

//   // ? cleanup
//   const taggedEntities = world.get('tagMeleeAttackTarget')
//   for (const entity of taggedEntities) {
//     world.modify(entity).remove('tagMeleeAttackTarget')
//     console.log(`handleMeleeAttack: cleanup - removed tagMeleeAttackTarget from ${entity.id}`)
//   }
// }
