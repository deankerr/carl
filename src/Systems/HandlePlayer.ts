// temp: should be unified with npc actions

import { ActionTypes } from '../Actions'
import { World } from '../World'
import { position } from '../Components'
import { TerrainDictionary } from '../Terrain'

export function handlePlayer(world: World, action: ActionTypes) {
  if (!action) {
    console.warn('Player: null action')
    return
  }

  if (action.move) {
    console.log('Player: move', action.move)

    const [player] = world.get('position', 'tagPlayer')
    const { position: oldPosition } = player

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    const terrain = world.state.__state.level.terrain.get(newX, newY) ?? 1

    // terrain walkable check
    // ? handle outcomes like 'bump'?
    if (TerrainDictionary[terrain].walkable) {
      const newPosition = position(newX, newY)
      world.updateComponent(player, newPosition)
    } else {
      console.log('bump')
    }
  } else {
    console.log('Player: unknown action:', action)
  }
}
