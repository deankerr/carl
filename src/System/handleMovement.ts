import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'
import { Cardinal, Direction } from '../lib/direction'

// , isPlayerTurn: boolean
export const handleMovement = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  if (!currentEntity) return
  const action = currentEntity.acting

  if (!('move' in action)) {
    // log.msg(`handleMovement: not a move action`)
    return
  }

  const { dir } = action.move
  // wait, just return (for now)
  if (action.move.dir === 'WAIT') {
    return
  }

  // update facing direction
  currentEntity.facing = facingMap[dir]

  const newPt = currentEntity.position.add(action.move.x, action.move.y)

  // debug no clip
  if (engine.options.debugMode && isPlayerTurn) {
    local.modify(currentEntity).define('acting', Action.Tread(newPt)).define('position', newPt)
    return
  }

  const entitiesHere = local.at(newPt)

  // walkable check
  if (entitiesHere.some(e => e.blocksMovement)) {
    local.modify(currentEntity).define('acting', Action.Bump(newPt))
    return
  }

  // valid move, create tread action and update position

  local.modify(currentEntity).define('acting', Action.Tread(newPt)).define('position', newPt)
}

const facingMap: Record<Direction, Cardinal> = {
  N: 'north',
  NE: 'east',
  E: 'east',
  SE: 'east',
  S: 'south',
  SW: 'west',
  W: 'west',
  NW: 'west',
  WAIT: 'east',
}
