// World handles entities? ECS helper?
import { Entity, Components, ComponentsU } from './Components'
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

  getID(id: string) {
    const entities = this.state.current.activeLevel.entities
    const result = entities.filter((e) => e.id === id)

    if (result.length > 1) {
      console.error('Got multiple entities for id ' + id)
      console.error(result)
      throw new Error()
    }

    if (result.length == 0) {
      console.error('No entities found for id ' + id)
      console.error(result)
      throw new Error()
    }

    return result[0]
  }

  update(entity: Entity, component: ComponentsU) {
    const ent2 = this.getID(entity.id)

    // const newEnt = { ...ent2, component }
    // this.state.updateEntity(newEnt)

    if ('position' in component) {
      const newEnt = { ...ent2, ...component }
      this.state.updateEntity(newEnt)
    }
  }
}

type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
