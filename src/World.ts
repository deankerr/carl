// World handles entities? ECS helper?

// import { createConsoleRender, createPosition } from './Components'
import { Entity } from './Components'
import { State } from './State'
import { Builder } from './Entity'

export class World {
  constructor(public state: State) {
    const dood = new Builder().position(5, 5).render('D', 'blue').build('doooood')
    state.addEntity(dood)
  }

  createEntity<C extends keyof Entity>(...comps: C[]) {
    console.log('World: createEntity')
    const id = this.state.nextEntityCount()

    // return new Entity(id)
  }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const entities = this.state.current.activeLevel.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as EntityWith<Entity, Key>[]
    console.log('query results:', results)
    return results
  }
}

type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
