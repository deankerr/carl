import { World } from '../Core/World'
import * as C from '../Component'

export const processGraphicUpdate = (world: World) => {
  const cyclers = world.get('render', 'cycleGraphic')

  for (const entity of cyclers) {
    const { render, cycleGraphic, id } = entity
    console.log('processGraphicUpdate:', id)
    console.log('render:', render)
    console.log('cycleGraphic:', cycleGraphic)

    const i = cycleGraphic.current + 1 >= cycleGraphic.list.length ? 0 : cycleGraphic.current + 1
    const nextGraphic = cycleGraphic.list[i]
    if (!nextGraphic) throw new Error('Unable to find next cycle graphic')

    const newRender = C.render({ base: nextGraphic })
    const newCycle = C.cycleGraphic(cycleGraphic.list, i)
    world.modify(entity).change(newRender).change(newCycle)
    console.log('processGraphicUpdate: graphic updated')
  }
}
