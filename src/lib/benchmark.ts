import { Engine } from '../Core'
import { DijkstraMap } from './Dijkstra'
import { loop } from './util'

export function benchmark(engine: Engine) {
  console.log('start benchmark')
  const ppos = engine.local.player().position
  const dmap = new DijkstraMap(engine.local.walkable())

  const times: number[] = []

  loop(20, () => {
    const t = performance.now()
    dmap.calculate(ppos)
    times.push(performance.now() - t)
  })

  const ttotal = times.reduce((a, c) => a + c)
  console.log('total', ttotal, 'avg:', ttotal / times.length)
  console.log('times:', times)
}
