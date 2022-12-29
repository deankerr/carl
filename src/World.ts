// World handles entities? ECS helper?
import { Entity } from './Components'
import { State } from './State'
import { Builder } from './Entity'

export class World {
  constructor(public state: State) {
    const pt1 = state.current.activeLevel.ptInRoom(1)
    const dood = new Builder().position(pt1.x, pt1.y).render('D', 'blue').build('doooood')
    state.addEntity(dood)

    const pt2 = state.current.activeLevel.ptInRoom(0)
    const player = new Builder().position(pt2.x, pt2.y).render('@', 'white').tagPlayer().build('player')
    state.addEntity(player)
  }

  // createEntity<C extends keyof Entity>(...comps: C[]) {
  //   console.log('World: createEntity')
  //   const id = this.state.nextEntityCount()

  //   // return new Entity(id)
  // }

  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const entities = this.state.current.activeLevel.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as EntityWith<Entity, Key>[]
    console.log('query results:', results)
    return results
  }
}

type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
