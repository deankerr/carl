import { ActionTypes, Engine } from '../Core'

const direction: Record<string, number> = {
  down: 1,
  up: -1,
}

export function handleRegionChange(engine: Engine, action: ActionTypes) {
  if (!('changeRegion' in action)) return

  const { atlas, index } = engine

  const domain = atlas[index]
  const to = action.changeRegion.going

  const next = index + direction[to]
  console.log('change', to)
  if (next < 0) return

  console.log('change2')
  engine.local = domain.regions[next]
  domain.current = domain.current + 1
}
