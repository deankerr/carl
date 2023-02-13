import { ActionTypes, Engine } from '../Core'

export function handleLocationChange(engine: Engine, action: ActionTypes) {
  if ('changeZone' in action) {
    const { to } = action.changeZone
    engine.atlas.setZone(to)
    engine.local = engine.atlas.local()
  }

  if ('changeRegion' in action) {
    const { going } = action.changeRegion
    if (going === 'down') engine.atlas.descend()
    if (going === 'up') engine.atlas.ascend()
    engine.local = engine.atlas.local()
  }
}
