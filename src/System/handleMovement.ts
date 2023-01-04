import { World } from '../Core/World'
import { acting, position } from '../Core/Components'
import { TerrainDictionary } from '../Core/Terrain'
import { Pt } from '../Model/Point'
import { Bump, Tread } from '../Action'

export const handleMovement = (world: World) => {
  const [entity] = world.get('acting', 'position', 'tagCurrentTurn')

  const action = entity.acting

  if ('move' in action) {
    console.log('handleMovement:', entity.id, action.move)

    // wait, just return (for now)
    if (action.move.dir === 'WAIT') {
      console.log('handleMovement: result - wait')
      return
    }

    const { position: oldPosition } = entity

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    // if null (out of bounds) act like its a wall
    const terrain = world.current.level.terrain.get(newX, newY) ?? 1

    // terrain walkable check
    if (!TerrainDictionary[terrain].walkable) {
      console.log('handleMovement: new action - Bump (terrain)')
      const newAction = acting(Bump(Pt(newX, newY)))
      world.updateComponent(entity, newAction)
      return
    }

    // entity blocking check
    const here = world.here(Pt(newX, newY))
    const entitiesWalkable = here[1].every((e) => 'tagCurrentTurn' in e || 'tagWalkable' in e)
    if (!entitiesWalkable) {
      console.log('handleMovement: new action - Bump (entity)')
      const newAction = acting(Bump(Pt(newX, newY)))
      world.updateComponent(entity, newAction)
      return
    } else {
      // create tread action
      console.log('handleMovement: new action - Tread')
      const newAction = acting(Tread(Pt(newX, newY)))
      const newEntity = world.updateComponent(entity, newAction)

      // update position
      const newPosition = position(newX, newY)
      world.updateComponent(newEntity, newPosition)
    }
  } else {
    console.log('handleMovement: not a move action', action)
  }
}
