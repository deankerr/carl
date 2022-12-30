// ECS Helper, works with writable state, sends updated state objects to State
import { Entity, ComponentsU } from './Components'
import { State, StateCurrent } from './State'
import { Builder } from './Entity'
import { DeepReadonly } from 'ts-essentials'

export class World {
  private state: State // The actual State instance
  current: StateCurrent // Just the readonly part, world readable

  constructor(state: State) {
    this.state = state
    this.current = state.current

    const pt1 = state.current.level.ptInRoom(1)
    const dood = new Builder().position(pt1.x, pt1.y).render('D', 'blue').build('dood')
    this.add(dood)

    const pt2 = state.current.level.ptInRoom(0)
    const player = new Builder().position(pt2.x, pt2.y).render('@', 'white').tagPlayer().build('player')
    this.add(player)
  }

  // === "Actions" ? ===

  // add new entity to state
  add(entity: Entity) {
    // stamp with next id
    const id = entity.id + '-' + this.state.nextEntityID()
    const newEntity = { ...entity, id }
    this.state.addEntity(newEntity)
  }

  // TODO:
  // createEntity<C extends keyof Entity>(...comps: C[]) {
  //   console.log('World: createEntity')
  //   const id = this.state.nextEntityCount()

  //   // return new Entity(id)
  // }

  get<Key extends keyof Entity>(...components: Key[]): DeepReadonly<EntityWith<Entity, Key>>[] {
    const entities = this.state.current.level.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as DeepReadonly<
      EntityWith<Entity, Key>
    >[]
    // console.log('query results:', results)
    return results
  }

  __getID(id: string) {
    const entities = this.state.__state.level.entities
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
    const oldEntity = this.state.__state.level.entities.find((e) => e === entity)

    if (!oldEntity) throw new Error('Unable to locate entity to update')

    // get the property key name. feels weird
    const componentName = Reflect.ownKeys(component).join()

    // verify entity had this component
    if (!(componentName in oldEntity)) {
      console.error('updateComponent: entity does not have that component')
      console.error(entity)
      console.error(component)
      throw new Error()
    }

    // copy old entity, replacing old component with new
    const newEntity = { ...oldEntity, ...component }
    this.state.updateEntity(oldEntity, newEntity)
  }
}

type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
