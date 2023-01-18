import { World } from '../Core/World'
import * as C from '../Component'
import { graphic } from '../Component'

export const processGraphicUpdate = (world: World) => {
  const cyclers = world.get('char', 'color', 'cycleGraphic')

  for (const entity of cyclers) {
    const { char, color, cycleGraphic, id } = entity
    console.log('processGraphicUpdate:', id)
    // console.log('render:', render)
    console.log('cycleGraphic:', cycleGraphic)

    const lastGraphic = graphic(char, color)
    const nextGraphic = cycleGraphic.pop()
    if (!nextGraphic) throw new Error('Unable to find next cycle graphic')

    const newRender = C.graphic(nextGraphic.char, nextGraphic.color)
    const newCycle = C.cycleGraphic([lastGraphic, ...cycleGraphic])
    world.modify(entity).change(newRender).change(newCycle)
    console.log('processGraphicUpdate: graphic updated')
  }
}
