import { World } from '../Core/World'
import { acting } from '../Component'
import { position } from '../Component/'
import { TerrainDictionary } from '../Core/Terrain'
import { Pt } from '../Model/Point'
import { Bump, Tread } from '../Action'

export const handleMovement = (world: World) => {
  const [currentEntity] = world.get('acting', 'position', 'tagCurrentTurn')

  const action = currentEntity.acting

  if (!('move' in action)) {
    console.log('handleMovement: not a move action', action)
    return
  }

  console.log('handleMovement:', currentEntity.id, action.move)
  const currentIsPlayer = 'tagPlayer' in currentEntity

  // wait, just return (for now)
  if (action.move.dir === 'WAIT') {
    console.log('handleMovement: result - wait')
    return
  }

  const newPt = Pt(currentEntity.position.x + action.move.dx, currentEntity.position.y + action.move.dy)

  // debug no clip
  if (world.options.debugMode && currentIsPlayer) {
    world.modify(currentEntity).change(position(newPt))
    return
  }

  // if null (out of bounds) act like its a wall
  const terrain = world.state.level.terrain.get(newPt) ?? 1

  // terrain walkable check
  if (!TerrainDictionary[terrain].walkable) {
    console.log('handleMovement: new action - Bump (terrain)')
    const newAction = acting(Bump(newPt))
    world.modify(currentEntity).change(newAction)
    return
  }

  // entity blocking check
  const here = world.here(newPt)
  const entitiesWalkable = here[1].every(e => 'tagCurrentTurn' in e || 'tagWalkable' in e)
  if (!entitiesWalkable) {
    console.log('handleMovement: new action - Bump (entity)')
    const newAction = acting(Bump(newPt))
    world.modify(currentEntity).change(newAction)
    return
  } else {
    // create tread action
    console.log('handleMovement: new action - Tread')
    const tread = acting(Tread(newPt))
    // update position
    const newPosition = position(newPt)
    world.modify(currentEntity).change(tread).change(newPosition)
  }
}
