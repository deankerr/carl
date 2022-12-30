// temp: should be unified with npc actions

import { Actions } from '../Actions'
import { StateCurrent } from '../State'
import { World } from '../World'
import { position } from '../Components'

export function handlePlayer(world: World, action: Actions) {
  console.log('Handle Player')
  if (!action) {
    console.error('null action')
    return
  }
  if (action.move) {
    console.log('player: move', action.move)

    const [player] = world.get('position', 'tagPlayer')
    const { position: oldPosition } = player

    const newPosition = position(oldPosition.x + action.move.dx, oldPosition.y + action.move.dy)

    world.update(player, newPosition)
  } else {
    console.log('unknown player action:', action)
  }
}
