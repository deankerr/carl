import { Engine } from '../Core/Engine'

export const handlePickUp = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [eActing] = local.get('acting', 'position')
  if (!eActing) return
  const { acting: action } = eActing

  if (!('pickUp' in action)) return

  const itemsHere = local.at(eActing.position).filter(e => e.item)

  if (itemsHere.length > 0) {
    // handle first item on the stack
    const [item] = itemsHere
    engine.message(`You stuff the ${item.name} into your bulging pantaloons.`, item)
    local.destroyEntity(item)
  } else {
    engine.message('You grasp at the air.', eActing)
  }
}
