// ECS Helper, works with writable state, sends updated state objects to State
import { Entity, ComponentsU } from './Components'
import { State } from './State'
import { Builder } from './Entity'
import { DeepReadonly } from 'ts-essentials'

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

  get<Key extends keyof Entity>(...components: Key[]): DeepReadonly<EntityWith<Entity, Key>>[] {
    const entities = this.state.current.activeLevel.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as DeepReadonly<
      EntityWith<Entity, Key>
    >[]
    // console.log('query results:', results)
    return results
  }

  __getID(id: string) {
    const entities = this.state.__state.activeLevel.entities
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

  // gets writable entity from state, updates component, sends back to state
  updateComponent(entity: Entity, component: ComponentsU) {
    const oldEntity = this.__getID(entity.id)

    // verify entity had this component
    if (Object.keys(component).join() in oldEntity) {
      const newEntity = { ...oldEntity, ...component }
      this.state.updateEntity(oldEntity, newEntity)
    } else {
      console.error('updateComponent: entity does not have that component')
      console.error(entity)
      console.error(component)
      throw new Error()
    }
  }
}

type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
