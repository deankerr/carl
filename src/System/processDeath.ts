import { Region } from '../Core/Region'

// remove dead entities from game
export const processDeath = (region: Region) => {
  const currentEntities = region.getTagged('dead')

  if (currentEntities.length === 0) return console.log('processDeath: no entities to remove')

  console.log('processDeath: reaping')
  for (const entity of currentEntities) {
    console.log('processDeath: removing', entity.label)
    region.destroy(entity)
    console.log('processDeath: removed', entity.label)
  }

  console.log('processDeath: process complete')
}
