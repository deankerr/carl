import { Engine } from '../Core'

export function processRegionGeneration(engine: Engine) {
  const { local, atlas, index } = engine
  console.log('local:', local, index)
  if (local) return

  const region = atlas[index].generator()
  atlas[index].regions.push(region)
  engine.local = region
}
