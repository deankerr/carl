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

  console.log('handleMovement:', currentEntity.eID, action.move)

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

  // terrain walkable check
  if (terrain.blocksMovement) {
    console.log('handleMovement: new action - Bump (terrain)', terrain)
    // const newAction = component.acting(Action.Bump(newPt))
    region.entity(currentEntity).modify('acting', Action.Bump(newPt))
    return
  }

  // entity blocking check
  const entitiesAreWalkable = entitiesHere.every(e => 'tagCurrentTurn' in e || 'tagWalkable' in e)
  if (!entitiesAreWalkable) {
    console.log('handleMovement: new action - Bump (entity)')
    // const newAction = component.acting(Action.Bump(newPt))
    // region.entity(currentEntity, newAction)
    region.entity(currentEntity).modify('acting', Action.Bump(newPt))
    return
  } else {
    // valid move, create tread action and update position
    console.log('handleMovement: new action - Tread')
    region.entity(currentEntity).modify('acting', Action.Tread(newPt)).modify('position', newPt)
  }
}
