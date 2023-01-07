// Entity/Component manager. Currently should be the only way to mutate game state
import * as ROT from 'rot-js'
import { tagCurrentTurn, Components } from './Components'
import { Entity, templates } from './Entity'
import { State, StateObject } from './State'
import { objLog } from '../util/util'
import { Point, Pt } from '../Model/Point'
import { Terrain, TerrainDictionary } from './Terrain'

export class World {
  private state: State // The actual State instance
  current: StateObject // reference to State.current (should be readonly/immutable?)
  readonly scheduler = new ROT.Scheduler.Simple() // ! should be on level?

  constructor(state: State) {
    this.state = state
    this.current = state.current

    this.__createDoors()
    this.__populate()
    this.message("You begin your queste's.")

    // font test
    // this.message('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    // this.message('abcdefghijklmn opqrstuvwxyz')
    // this.message('1234 567890')

    this.nextTurn() // set the currentTurn
  }

  // TODO Move this responsibility to Generate(?)
  __populate() {
    const level = this.state.current.level

    this.add(templates.player(level.ptInRoom(0), 5))

    const npcs = ROT.RNG.shuffle([
      'orc',
      'spider',
      'snake',
      'toad',
      'crab',
      'ghost',
      'demon',
      'hammerhead',
      'skeleton',
      'chicken',
      'bat',
      'karl',
    ])

    level.rooms.forEach((_r, i) => {
      if (i === 0 || i >= npcs.length) return
      const pos = level.ptInRoom(i)
      const choice = npcs[i]
      if (templates[choice]) this.add(templates[choice](pos))
    })
  }

  __createDoors() {
    const level = this.state.current.level

    for (const doorPt of level.doors) {
      const door = templates.door(doorPt)
      this.add(door)
    }
  }

  /*
    World API
    Everything that happens in the game should occur through this API.

    - Currently has duplicate functionality/concept with State
    - Consider making entity references id based to reduce old/newEntity boilerplate
  */

  // add new entity to state
  add(entity: Entity) {
    // stamp with next id
    const id = entity.id + '-' + this.state.nextEntityID()
    const newEntity = { ...entity, id }
    this.state.addEntity(newEntity)
    // add actors to turn queue
    if ('tagActor' in newEntity) this.scheduler.add(newEntity.id, true)
    return newEntity
  }

  // return all entities with specified components
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const entities = this.state.current.level.entities
    const results = entities.filter((e) => components.every((name) => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  // return entity with component if it has it
  with<Key extends keyof Entity>(entity: Entity, component: Key): EntityWith<Entity, Key> | null {
    if (component in entity) return entity as EntityWith<Entity, Key>
    return null
  }

  // return terrain and any entities at this position
  here(pt: Point): [Terrain, Entity[]] {
    const t = this.state.current.level.terrain.get(pt)
    if (t === null) throw new Error('here: null terrain')
    const terrain = TerrainDictionary[t]

    const entities = this.get('position')
    const entitiesHere = entities.filter((e) => Pt(e.position.x, e.position.y).s === pt.s) as Entity[]

    return [terrain, entitiesHere]
  }

  // remove entity from the world + turn queue if necessary
  remove(entity: Entity) {
    console.log('World: remove entity', entity.id)
    const targetEntity = this.current.level.entities.find((e) => e === entity)
    if (!targetEntity) throw new Error('remove: Unable to locate entity to remove')
    this.state.deleteEntity(targetEntity)

    // turn queue
    const actorEntity = this.with(entity, 'tagActor')
    if (actorEntity) {
      console.log('World: removing entity from turn queue', actorEntity.id)
      const result = this.scheduler.remove(actorEntity.id)
      if (result) console.log('World: done')
      else throw new Error('World: could not remove entity from turn queue')
    } else {
      console.log('World: removed entity was not an actor')
    }

    this.current.graveyard.push(targetEntity.id)
  }

  addComponent<C extends Components>(entity: Entity, component: C) {
    const entities = this.state.current.level.entities
    const oldEntity = entities.find((e) => e === entity)
    // if (!oldEntity) throw new Error('addC: Unable to locate entity to update')
    if (!oldEntity) {
      console.error('addC: Unable to locate entity to update')
      objLog(entity, 'target')
      objLog(this.getByID(entity.id), 'probably')
      console.groupCollapsed('all entities')
      objLog(entities, 'all')
      console.groupEnd()
      throw new Error()
    }

    const componentName = Reflect.ownKeys(component).join()

    // verify entity doesn't already have this component
    if (componentName in oldEntity) {
      console.error('addComponent: entity already has that component')
      console.error(component)
      console.error(entity)
      throw new Error()
    }

    const newEntity = { ...oldEntity, ...component }
    this.state.updateEntity(oldEntity, newEntity)

    return newEntity
  }

  // gets writable entity from state, updates component, sends back to state
  updateComponent<C extends Components>(entity: Entity, component: C) {
    // console.log('Start updateComponent', entity.id, Reflect.ownKeys(component).join())
    const entities = this.state.current.level.entities
    const oldEntity = entities.find((e) => e === entity)
    // if (!oldEntity) throw new Error('updateC: Unable to locate entity to update')
    if (!oldEntity) {
      console.error('updateC: Unable to locate entity to update')
      objLog(component, 'component')
      objLog(entity, 'target')
      objLog(this.getByID(entity.id), 'probably')
      console.groupCollapsed('all entities')
      objLog(entities, 'all', true)
      console.groupEnd()
      throw new Error()
    }

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
    const oldEntity = this.state.current.level.entities.find((e) => e === entity)
    if (!oldEntity)
      throw new Error(`removeC: Unable to locate entity "${entity?.id}" to remove component "${componentName}"`)

    const newEntity = { ...oldEntity }
    Reflect.deleteProperty(newEntity, componentName)

    this.state.updateEntity(oldEntity, newEntity)

    return newEntity
  }

  nextTurn() {
    const prev = this.get('tagCurrentTurn')
    if (prev.length > 1) throw new Error('Multiple entities with current turn')
    if (prev.length > 0) this.removeComponent(prev[0], 'tagCurrentTurn')
    if (prev.length === 0) console.log('No tagCurrentTurn found')

    const nextID = this.scheduler.next()
    // console.log('next turn:', nextID)
    const next = this.getByID(nextID)
    this.addComponent(next, tagCurrentTurn())

    // return true if its the player's turn
    const playerTurn = this.get('tagCurrentTurn', 'tagPlayer')
    return playerTurn.length === 1 ? true : false
  }

  getByID(id: string) {
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

  // add a message to the buffer
  message(msg: string) {
    const { messages, playerTurns } = this.state.current
    console.log('msg:', msg)
    // empty buffer
    if (messages.length === 0) messages.push([playerTurns, [msg]])
    // add to existing buffer for this turn
    else if (messages[0][0] === playerTurns) messages[0][1].push(msg)
    // new buffer for this turn
    else messages.unshift([playerTurns, [msg]])
  }
}

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
