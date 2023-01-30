/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Action from '../Action'
import { Region } from '../Core/Region'

export const handleMovement = (region: Region, isPlayerTurn: boolean) => {
  const [currentEntity] = region.get('acting', 'position')
  const action = currentEntity.acting

  if (!('move' in action)) {
    console.log('handleMovement: not a move action', action)
    return
  }

  console.log('handleMovement:', currentEntity.label, action.move)

  // wait, just return (for now)
  if (action.move.dir === 'WAIT') {
    console.log('handleMovement: result - wait')
    return
  }

  const newPt = currentEntity.position.pt.add(action.move.x, action.move.y)

  // debug no clip
  // if (world.options.debugMode && currentIsPlayer) {
  //   world.modify(currentEntity).change(position(newPt))
  //   return
  // }

  const [terrain, entitiesHere] = region.at(newPt)

  // walkable check
  if (terrain.blocksMovement || entitiesHere.some(e => e.blocksMovement)) {
    console.log('handleMovement: new action - Bump ')
    region.entity(currentEntity).modify('acting', Action.Bump(newPt))
    return
  }

  // valid move, create tread action and update position
  console.log('handleMovement: new action - Tread')
  region.entity(currentEntity).modify('acting', Action.Tread(newPt)).modify('position', newPt)
}
