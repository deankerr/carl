import { Point } from '../../lib/Shape/Point'
import { Rect } from '../../lib/Shape/Rectangle'
import { rnd } from '../../lib/util'

type CellularAutomataConfig = {
  initialChance: number
  survival: number
  birth: number
  iterations: number
}

export function cellularAutomata(rect: Rect, config: CellularAutomataConfig) {
  // true = alive, false = unalive
  const initialState = new Map<Point, boolean>()

  for (const pt of rect.each()) {
    initialState.set(pt, rnd(100) < config.initialChance)
  }

  const generations = [initialState]

  for (let i = 0; i < config.iterations; i++) {
    const prevState = generations[i]
    const nextState = new Map<Point, boolean>()

    // count the amount of living neighbours for each cell, resulting in its survival/birth
    // in the next generation
    for (const [pt, state] of prevState) {
      let count = 0
      const required = state ? config.survival : config.birth

      for (const npt of pt.neighbours()) {
        // consider undefined points (ie. off the edge of the grid) to be alive
        const neighbourState = prevState.get(npt) ?? true
        if (neighbourState) {
          count++
          if (count >= required) break
        }
      }

      nextState.set(pt, count >= required)
    }

    generations.push(nextState)
  }

  return generations
}
