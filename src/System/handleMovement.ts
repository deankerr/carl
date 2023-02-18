import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'
import { logger } from '../lib/logger'

// , isPlayerTurn: boolean
export const handleMovement = (engine: Engine, isPlayerTurn: boolean) => {
  const log = logger('sys', 'handleMovement')
  const { local } = engine
  const [currentEntity] = local.get('acting', 'position')
  if (!currentEntity) return
  const action = currentEntity.acting

  if (!('move' in action)) {
    // log.msg(`handleMovement: not a move action`)
    return
  }

  log.msg('handleMovement:', currentEntity.label, action.move.dir)

  // wait, just return (for now)
  if (action.move.dir === 'WAIT') {
    log.msg('handleMovement: result - wait')
    return
  }

  const newPt = currentEntity.position.add(action.move.x, action.move.y)

  // debug no clip
  if (engine.options.debugMode && isPlayerTurn) {
    local.entity(currentEntity).modify('acting', Action.Tread(newPt)).modify('position', newPt)
    return
  }

  const entitiesHere = local.at(newPt)

  // walkable check
  if (entitiesHere.some(e => e.blocksMovement)) {
    log.msg('handleMovement: new action - Bump ')
    local.entity(currentEntity).modify('acting', Action.Bump(newPt))
    return log.end()
  }

  // valid move, create tread action and update position
  log.msg('handleMovement: new action - Tread')
  local.entity(currentEntity).modify('acting', Action.Tread(newPt)).modify('position', newPt)

  log.end()
}
