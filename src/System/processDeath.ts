import { Engine } from '../Core/Engine'

// remove dead entities from game
export const processDeath = (engine: Engine) => {
  const { local } = engine
  const currentEntities = local.get('dead')

  if (currentEntities.length === 0) return console.log('processDeath: no entities to remove')

  console.log('processDeath: reaping')
  for (const entity of currentEntities) {
    console.log('processDeath: removing', entity.label)
    local.destroy(entity)
    console.log('processDeath: removed', entity.label)
  }

  console.log('processDeath: process complete')
}
