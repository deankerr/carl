import { World } from '../Core/World'
import { acting, position } from '../Core/Components'
import { TerrainDictionary } from '../Core/Terrain'
import { strCmp } from '../util/util'
import { Pt } from '../Model/Point'
import { bump } from '../Action'

export function handleMovement(world: World) {
  const [entity] = world.get('acting', 'position', 'tagCurrentTurn')

  const action = entity.acting
  if (!action) {
    console.warn('Move: null action')
    return
  }

  if ('move' in action) {
    console.log('Move:', entity, action.move)
    const { position: oldPosition } = entity
    const allEntities = world.get('position')

    const newX = oldPosition.x + action.move.dx
    const newY = oldPosition.y + action.move.dy

    // if null (out of bounds) act like its a wall
    const terrain = world.current.level.terrain.get(newX, newY) ?? 1

    // terrain walkable check
    if (!TerrainDictionary[terrain].walkable) {
      console.log('Move: Terrain BUMP!')
      const newAction = acting(bump(Pt(newX, newY)))
      world.updateComponent(entity, newAction)
      return
    }

    // entity blocking check
    // ? entitiesHere probably should be a World method
    const entityHere = allEntities.some((e) => {
      if (e.id === entity.id) return false
      return strCmp(e.position, Pt(newX, newY))
    })

    if (entityHere) {
      console.log('Move: Entity BUMP!')
      const newAction = acting(bump(Pt(newX, newY)))
      world.updateComponent(entity, newAction)
      return
    }

    // update position
    const newPosition = position(newX, newY)
    world.updateComponent(entity, newPosition)
  } else {
    console.log('Move: not a move action', action)
  }
}
