// Entity/Component manager. Currently should be the only way to mutate game state
import * as ROT from 'rot-js'
import { tagCurrentTurn, Components, componentName } from './Components'
import { Entity, templates } from './Entity'
import { State, StateObject } from './State'
import { objLog, rnd } from '../util/util'
import { Point, Pt } from '../Model/Point'
import { Terrain, TerrainDictionary } from './Terrain'
import { Game } from './Game'

export class World {
  private state: State // The actual State instance
  current: StateObject // reference to State.current (should be readonly/immutable?)
  readonly scheduler = new ROT.Scheduler.Simple() // ! should be on level?
  options: Game['options']

  constructor(state: State, options: Game['options']) {
    this.state = state
    this.current = state.current
    this.options = options

    const { entities } = this.current.level
    if (entities.length === 0) {
      this.__createDoors()
      this.__features()
    } else {
      entities.forEach(e => this.add(e))
    }

    this.__populateNPCs()

    this.message("You begin your queste's.")

    // font test
    // this.message('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    // this.message('abcdefghijklmn opqrstuvwxyz')
    // this.message('1234 567890')

    this.nextTurn() // set the currentTurn
  }

  // TODO Move this responsibility to Generate(?)
  __populateNPCs() {
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
    if (!level.doors) return

    for (const doorPt of level.doors) {
      const door = templates.door(doorPt)
      this.add(door)
    }
  }

  __features() {
    const level = this.state.current.level

    level.rooms.forEach((r, i) => {
      // shrubbery
      if (i % 3 === 0) {
        for (let j = 0; j < 6; j++) this.add(templates.shrub(level.ptInRoom(i)))
      }

      // water
      if (i % 4 === 1) {
        r.rect.traverse((x, y) => {
          level.terrain.set(Pt(x, y), 3)
        })
      }
    })

    // cracked walls/paths
    level.terrain.each((pt, t) => {
      if (t === 0 && rnd(0, 3) === 0) level.terrain.set(pt, rnd(4, 7))
      if (t === 1 && rnd(0, 16) === 0) level.terrain.set(pt, 2)
    })
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
    const results = entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
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
    // pretend its a wall if out of bounds?
    const terrain = t ? TerrainDictionary[t] : TerrainDictionary[1]
    const entities = this.get('position')
    const entitiesHere = entities.filter(e => Pt(e.position.x, e.position.y).s === pt.s) as Entity[]

    return [terrain, entitiesHere]
  }

  hereWith<Key extends keyof Entity>(pt: Point, ...components: Key[]): [Terrain, EntityWith<Entity, Key>[]] {
    const t = this.state.current.level.terrain.get(pt)
    // pretend its a wall if out of bounds?
    const terrain = t ? TerrainDictionary[t] : TerrainDictionary[1]
    const entitiesHere = this.get('position').filter(e => e.position.s === pt.s) as Entity[]
    const entitiesWith = entitiesHere.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return [terrain, entitiesWith]
  }

  // remove entity from the world + turn queue if necessary
  remove(entity: Entity) {
    console.log('World: remove entity', entity.id)
    const targetEntity = this.current.level.entities.find(e => e === entity)
    if (!targetEntity) throw new Error('remove: Unable to locate entity to remove')
    this.state.deleteEntity(targetEntity)

    // turn queue
    const actorEntity = this.with(entity, 'tagActor')
    if (actorEntity) {
      const result = this.scheduler.remove(actorEntity.id)
      if (!result) throw new Error('World: could not remove entity from turn queue')
    }
    this.current.graveyard.push(targetEntity.id)
  }

  addComponent<C extends Components>(entity: Entity, component: C) {
    const entities = this.state.current.level.entities
    const oldEntity = entities.find(e => e === entity)

    if (!oldEntity) {
      this.EntityComponentException('addComponent: cannot locate', entity, component)
      throw new Error()
    }

    // verify entity doesn't already have this component
    if (componentName(component) in oldEntity) {
      this.EntityComponentException('addComponent: already has component', entity, component)
      throw new Error()
    }

    const newEntity = { ...oldEntity, ...component }
    this.state.updateEntity(oldEntity, newEntity)

    return newEntity
  }

  // gets writable entity from state, updates component, sends back to state
  updateComponent<C extends Components>(entity: Entity, component: C) {
    const entities = this.state.current.level.entities
    const oldEntity = entities.find(e => e === entity)

    if (!oldEntity) {
      this.EntityComponentException('updateComponent: cannot locate', entity, component)
      throw new Error()
    }

    // verify entity had this component
    if (!(componentName(component) in oldEntity)) {
      this.EntityComponentException('update: already has', entity, component)
      throw new Error()
    }

    // copy old entity, replacing old component with new
    const newEntity = { ...oldEntity, ...component }
    this.state.updateEntity(oldEntity, newEntity)

    // return the new entity if further updates needed
    return newEntity
  }

  updateComponents<C extends Components>(entity: Entity, components: C) {
    const entities = this.state.current.level.entities
    const oldEntity = entities.find(e => e === entity)

    if (!oldEntity) {
      this.EntityComponentException('updateComponent: cannot locate', entity, components)
      throw new Error()
    }

    Object.keys(components).forEach(c => {
      // verify entity had this component
      if (!(c in oldEntity)) {
        this.EntityComponentException('update: did not have', entity, components)
        throw new Error()
      }
    })

    // copy old entity, replacing old component with new
    const newEntity = { ...oldEntity, ...components }
    this.state.updateEntity(oldEntity, newEntity)

    // return the new entity if further updates needed
    return newEntity
  }

  removeComponent(entity: Entity, componentName: keyof Components) {
    const oldEntity = this.state.current.level.entities.find(e => e === entity)
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
    if (prev.length === 0) console.log('No tagCurrentTurn found')
    if (prev.length > 0) this.removeComponent(prev[0], 'tagCurrentTurn')

    const nextID = this.scheduler.next()
    const next = this.getByID(nextID)
    this.addComponent(next, tagCurrentTurn())

    // return true if its the player's turn
    const playerTurn = this.get('tagCurrentTurn', 'tagPlayer')
    return playerTurn.length === 1 ? true : false
  }

  getByID(id: string) {
    const entities = this.state.current.level.entities
    const result = entities.filter(e => e.id === id)

    if (result.length > 1) throw new Error('Got multiple entities for id ' + id)
    if (result.length == 0) throw new Error('No entities found for id ' + id)

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

  isTransparent(x: number, y: number) {
    const here = Pt(x, y)
    const t = this.state.current.level.terrain.get(here)
    if (t === null) return false
    const opaqueEntities = this.get('tagBlocksLight', 'position').filter(e => e.position.s === here.s).length === 0
    return opaqueEntities && TerrainDictionary[t].transparent
  }

  EntityComponentException<C extends Components>(error: string, entity: Entity, component: C | C[]) {
    console.error(error)
    objLog(component, 'component')
    objLog(entity, 'target')
    objLog(this.getByID(entity.id), 'probably')
    console.groupCollapsed('all entities')
    objLog(this.current.level.entities, 'all', true)
    console.groupEnd()
  }

  // entity build/manage
  entityManage(e: Entity) {
    return eManager(this.current, e)
  }
}

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

const eManager = (state: StateObject, target: Entity) => {
  const newEntity = state.level.entities.find(e => e === target)
  if (!newEntity) throw new Error('eMan cannot locate' + target.id)

  let entity = newEntity

  console.log('eManager:', entity)

  const add = <C extends Components>(c: C) => {
    // check it did not already exist
    if (componentName(c) in entity) throw new Error(`add: Already has component ${entity.id} ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)
    console.log('add', entity, c)

    return { entity, add, change, remove }
  }

  const change = <C extends Components>(c: C) => {
    // check it currently does exist
    if (!(componentName(c) in entity)) throw new Error(`change: ${entity.id} does not have ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)
    console.log('update', entity, c)

    return { entity, add, change, remove }
  }

  const remove = <N extends keyof Components>(cName: N) => {
    // check it currently does exist
    if (!(cName in entity)) throw new Error(`remove: ${entity.id} does not have ${cName}`)

    Reflect.deleteProperty(entity, cName)
    updateState(entity)
    console.log('remove', entity, cName)
    return { entity, add, change, remove }
  }

  const updateState = (entity: Entity) => {
    const index = state.level.entities.findIndex(e => e.id === entity.id)
    if (index < 0) throw new Error('Cannot find that ID')
    state.level.entities[index] = entity
    console.log('uState:', entity.id)
  }

  return { entity, add, change, remove }
}
// const testEnt = templates.karl(Pt(1, 2))
// console.log('testEnt:', testEnt)
// const k2 = eManager(testEnt)
//   .addC(tagBlocksLight())
//   .updateC(position(Pt(4, 5)))
//   .removeC('render').e

// console.log('k2:', k2)
// class WorldEntity {
//   constructor(private entity: Entity) {}

//   add<C extends Components>(c: C) {
//     // check for components first
//     this.entity = { ...this.entity, ...c }
//     return this
//   }

//   update<C extends Components>(c: C) {
//     // check for existing
//     this.entity = { ...this.entity, ...c }
//     return this
//   }

//   remove<N extends keyof Components>(c: N) {
//     // check for existing
//     Reflect.deleteProperty(this.entity, c)
//     return this
//   }

//   // done() {
//   // this.current.level.entities.push(entity) //add
//   // }

//   static manage(entity: Entity) {
//     return new WorldEntity(entity)
//   }

//   // static create() {
//   // return new WorldEntity({id: blah})
//   // }
// }

// WorldEntity.manage(teste)
//   .add({ ...tagBlocksLight(), ...tagWalkable() })
//   .update({ ...door(true) })

// class WorldQuery {
//   entities: Entity[] = []

//   get<N extends keyof Components>(c: N) {
//     //
//   }
// }
/*
  world.update(doorent)
    .add(...tagWalkable())
    .update(...doorOpen(true))
    .remove('tagBlocksLight')
    .done()

  world.transform(doorEntity)
    .add(tagWalkable())
    .update(doorOpen(true))
    .remove('tagBlocksLight')
    .done()


    const entities = world.get('position', 'render').filter(e => doors.every(d => d.id !== e.id) && e !== player)
    const entities = world.get('position', 'render').without('doors').isNot(player)
*/

// type ttt = keyof Components
