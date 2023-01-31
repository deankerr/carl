/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const handleMovement = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
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

  const newPt = currentEntity.position.add(action.move.x, action.move.y)

  // debug no clip
  // if (world.options.debugMode && currentIsPlayer) {
  //   world.modify(currentEntity).change(position(newPt))
  //   return
  // }

  const [terrain, entitiesHere] = local.at(newPt)

  // walkable check
  if (terrain.blocksMovement || entitiesHere.some(e => e.blocksMovement)) {
    console.log('handleMovement: new action - Bump ')
    local.entity(currentEntity).modify('acting', Action.Bump(newPt))
    return
  }

  // valid move, create tread action and update position
  console.log('handleMovement: new action - Tread')
  local.entity(currentEntity).modify('acting', Action.Tread(newPt)).modify('position', newPt)
}
