// temp: should be unified with npc actions

import { ActionTypes } from '../Actions'
import { World } from '../World'
import { position } from '../Components'
import { TerrainDictionary } from '../Terrain'

export function handlePlayer(world: World, action: ActionTypes) {
  console.log('Handle Player')

  if (!action) {
    console.warn('Player: null action')
    return
  }

  if (action.move) {
    console.log('player: move', action.move)

    const [player] = world.get('position', 'tagPlayer')
    const { position: oldPosition } = player

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    const terrain = world.current.activeLevel.terrain.get(newX, newY)
    if (TerrainDictionary[terrain].walkable) {
      const newPosition = position(newX, newY)
      world.updateComponent(player, newPosition)
    } else {
      console.log('bump')
    }
  } else {
    console.log('unknown player action:', action)
  }
}
