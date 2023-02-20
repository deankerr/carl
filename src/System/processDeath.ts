import { Engine } from '../Core/Engine'

// remove dead entities from game
export const processDeath = (engine: Engine) => {
  const { local } = engine
  const currentEntities = local.get('dead')

  if (currentEntities.length === 0) return

  for (const entity of currentEntities) {
    local.destroy(entity)
  }
}
