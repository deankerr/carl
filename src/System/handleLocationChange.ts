import { ActionTypes, Engine } from '../Core'

export function handleLocationChange(engine: Engine, isPlayerTurn: boolean, force?: ActionTypes) {
  if (!isPlayerTurn) return

  const action = force ? force : engine.local?.get('acting')[0]?.acting
  if (!action) return console.log('handleLocationChange: no action')

  if ('changeLocation' in action) {
    console.log('change Location')
    const { zone, level } = action.changeLocation
    engine.atlas.setZone(zone)

    if (level === 'down') engine.atlas.descend()
    if (level === 'up') engine.atlas.ascend()

    engine.local = engine.atlas.local()
  }

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
