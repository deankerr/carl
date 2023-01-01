// ECS Helper, works with writable state, sends updated state objects to State
import * as ROT from 'rot-js'
import { Entity, ComponentsU, tagCurrentTurn, Components } from './Components'
import { State, StateObject } from './State'
import { Builder } from './Components'
import { UpdateFOV } from './Systems/UpdateFOV'

export class World {
  private state: State // The actual State instance
  current: StateObject
  readonly scheduler = new ROT.Scheduler.Simple() // ! should be on level
  private currentTurn: Entity | null = null

  constructor(state: State) {
    this.state = state
    this.current = state.current

    const pt1 = state.current.level.ptInRoom(1)
    const dood = new Builder().position(pt1.x, pt1.y).render('D', 'blue').build('dood')
    const nDood = this.add(dood)

    const pt2 = state.current.level.ptInRoom(0)
    const player = new Builder().position(pt2.x, pt2.y).render('@', 'white').tagPlayer().fov(5).seen().build('player')
    const nPlayer = this.add(player)
    UpdateFOV(this)

    this.scheduler.add(nPlayer.id, true)
    this.scheduler.add(nDood.id, true)
  }

  // === "Actions" ? ===

  // add new entity to state
  add(entity: Entity) {
    // stamp with next id
    const id = entity.id + '-' + this.state.nextEntityID()
    const newEntity = { ...entity, id }
    this.state.addEntity(newEntity)
    return newEntity
  }

  // return all entities with specified components
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const entities = this.state.current.level.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as EntityWith<Entity, Key>[]
    // console.log('query results:', results)
    return results
  }

  // return entity with component if it has it
  with<Key extends keyof Entity>(entity: Entity, component: Key): EntityWith<Entity, Key> | null {
    if (component in entity) return entity as EntityWith<Entity, Key>
    return null
  }

  addComponent(entity: Entity, component: ComponentsU) {
    const oldEntity = this.state.current.level.entities.find((e) => e === entity)
    if (!oldEntity) throw new Error('addC: Unable to locate entity to update')

    const componentName = Reflect.ownKeys(component).join()

    // verify entity doesn't already have this component
    if (componentName in oldEntity) {
      console.error('addComponent: entity already has that component')
      console.error(entity)
      console.error(component)
      throw new Error()
    }

    const newEntity = { ...oldEntity, ...component }
    this.state.updateEntity(oldEntity, newEntity)

    return newEntity
  }

  // gets writable entity from state, updates component, sends back to state
  updateComponent(entity: Entity, component: ComponentsU) {
    const oldEntity = this.state.current.level.entities.find((e) => e === entity)
    if (!oldEntity) throw new Error('updateC: Unable to locate entity to update')

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

    // return the new entity if further updates needed
    return newEntity
  }

  removeComponent(entity: Entity, componentName: keyof Components) {
    console.log('%cRemove', 'color: red')
    const oldEntity = this.state.current.level.entities.find((e) => e === entity)
    if (!oldEntity) throw new Error('removeC: Unable to locate entity to update')

    const newEntity = { ...oldEntity }
    Reflect.deleteProperty(newEntity, componentName)

    this.state.updateEntity(oldEntity, newEntity)

    return newEntity
  }

  nextTurn() {
    if (this.currentTurn) {
      const prev = this.get('tagCurrentTurn')
      console.log('prev:', prev)
      if (prev.length > 1) throw new Error('Multiple entities with current turn')
      if (prev.length > 0) this.removeComponent(prev[0], 'tagCurrentTurn')
    }
    const nextID = this.scheduler.next()
    console.log('next turn:', nextID)
    const next = this.getID(nextID)
    console.log('next:', next)
    const nNext = this.addComponent(next, tagCurrentTurn())
    console.log(nNext)
    this.currentTurn = nNext
    return nextID
  }

  // * May never need this?
  getID(id: string) {
    const entities = this.state.current.level.entities
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
}

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
