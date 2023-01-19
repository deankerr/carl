import { cycleGraphic, graphic } from '../Component'
import { World } from '../Core/World'

export function processAnimation(world: World) {
  const cyclers = world.get('cycleGraphic')
  if (cyclers.length === 0) return
  for (const entity of cyclers) {
    const { list, frequency, current, lastUpdate } = entity.cycleGraphic

    if (Date.now() - lastUpdate < frequency) continue

    const c = current + 1 >= list.length ? 0 : current + 1
    world
      .modify(entity)
      .noLog()
      .change(graphic(list[c].char, list[c].color))
      .change(cycleGraphic(list, frequency, c, Date.now()))

    world.hasChanged = true
  }
}
