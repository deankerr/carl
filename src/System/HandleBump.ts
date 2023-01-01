import { World } from '../Core/World'

export function handleBump(world: World) {
  const action = world.current.action

  if (!action) return console.log('Bump: null action')
  if (!('bump' in action)) return console.log('Bump: not a bump action')

  console.log('A bump has occurred', action.bump)
}
