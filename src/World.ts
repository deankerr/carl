// World handles entities? ECS helper?

import { ConsoleRender, Position } from './Components'
import { Entity } from './Entity'
import { State } from './State'

export class World {
  constructor(public state: State) {
    // demo entities
    const e = this.createEntity()
    e.components.Position = Position(8, 8)
    e.components.ConsoleRender = ConsoleRender('@', 'brown')
    state.addEntity(e)

    const e2 = this.createEntity()
    e2.components.Position = Position(12, 12)
    e2.components.ConsoleRender = ConsoleRender('g', 'blue')
    state.addEntity(e2)

    // e.components.ConsoleRender.char = 'o'
  }

  createEntity() {
    console.log('World: createEntity')
    const id = this.state.nextEntityCount()
    return new Entity(id)
  }
}
