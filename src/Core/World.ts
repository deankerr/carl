// Entity/Component manager
import { Components, componentName } from './Components'
import { tagCurrentTurn } from '../Component'
import { Entity, hydrateBeing, hydrateDecor, createPlayer, EntityTemplates, createDoor } from './Entity'
import { StateObject } from './State'
import { objLog } from '../lib/util'
import { Point, Pt } from '../Model/Point'
import { TerrainType, TerrainNumMap } from './Terrain'
import { Game } from './Game'
import { Level } from '../Model/Level'

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export class World {
  state: StateObject
  active: Level
  options: Game['options']

  constructor(state: StateObject, options: Game['options']) {
    this.state = state
    this.options = options
    this.active = state.active

    this.message('You begin your queste.')
    // this.message('Test message display. Test message display. Test message display. Test message display.')
  }

  //  World API - Everything that happens in the game should occur through this API.

  createTemplates(newTemplates: EntityTemplates) {
    if (newTemplates.player) {
      const pt = newTemplates.player
      this.createPlayer(pt)
    }

    if (newTemplates.beings) {
      for (const being of newTemplates.beings) {
        const [t, pos] = being
        const entity = this.create(hydrateBeing(t, pos === 0 ? this.active.ptInRoom() : pos))
        if ('tagActor' in entity) this.active.scheduler.add(entity.id, true)
      }
    }

    if (newTemplates.features) {
      for (const feature of newTemplates.features) {
        const [t, pos] = feature
        this.create(hydrateDecor(t, pos === 0 ? this.active.ptInRoom() : pos))
      }
    }

    if (newTemplates.doors) {
      for (const pt of newTemplates.doors) {
        this.create(createDoor(pt))
      }
    }
  }

  createPlayer(pt?: Point) {
    if (this.get('tagPlayer').length > 0) return

    const player = this.create(createPlayer(pt ?? this.active.stairsAscending ?? this.active.ptInRoom()))
    this.active.scheduler.add(player.id, true)
  }

  // add new entity to state
  create(entity: Entity) {
    // stamp with next id
    const id = entity.id + '-' + this.state.nextID++
    const newEntity = { ...entity, id }
    this.active.entities.push(newEntity)
    return newEntity
  }

  // return all entities with specified components
  get<Key extends keyof Entity>(...components: Key[]): EntityWith<Entity, Key>[] {
    const entities = this.active.entities
    const results = entities.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return results
  }

  // return entity with component if it has it
  with<Key extends keyof Entity>(entity: Entity, component: Key): EntityWith<Entity, Key> | null {
    if (component in entity) return entity as EntityWith<Entity, Key>
    return null
  }

  // return terrain and any entities at this position
  here(pt: Point): [TerrainType, Entity[]] {
    const t = this.active.terrainGrid.get(pt)
    // pretend its a wall if out of bounds?
    const terrain = t !== null ? TerrainNumMap[t] : TerrainNumMap[99]
    const entities = this.get('position')
    const entitiesHere = entities.filter(e => Pt(e.position.x, e.position.y).s === pt.s) as Entity[]

    return [terrain, entitiesHere]
  }

  hereWith<Key extends keyof Entity>(pt: Point, ...components: Key[]): [TerrainType, EntityWith<Entity, Key>[]] {
    const t = this.active.terrainGrid.get(pt)
    // pretend its a wall if out of bounds?
    const terrain = t !== null ? TerrainNumMap[t] : TerrainNumMap[1]
    const entitiesHere = this.get('position').filter(e => e.position.s === pt.s) as Entity[]
    const entitiesWith = entitiesHere.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
    return [terrain, entitiesWith]
  }

  // remove entity from the world + turn queue if necessary
  destroy(entity: Entity) {
    console.log('World: remove entity', entity.id)
    this.active.entities = this.active.entities.filter(e => e.id !== entity.id)

    // turn queue
    const actorEntity = this.with(entity, 'tagActor')
    if (actorEntity) {
      const result = this.active.scheduler.remove(actorEntity.id)
      if (!result) throw new Error('World: could not remove entity from turn queue')
    }
    this.state.graveyard.push(entity.id)
  }

  nextTurn() {
    const prev = this.get('tagCurrentTurn')
    if (prev.length > 1) throw new Error('Multiple entities with current turn')
    if (prev.length === 0) console.log('No tagCurrentTurn found')
    if (prev.length > 0) this.modify(prev[0]).remove('tagCurrentTurn')

    const nextID = this.active.scheduler.next()
    const next = this.getByID(nextID)
    this.modify(next).add(tagCurrentTurn())

    // return true if its the player's turn
    const playerTurn = this.get('tagCurrentTurn', 'tagPlayer')
    return playerTurn.length === 1 ? true : false
  }

  getByID(id: string) {
    const entities = this.active.entities
    const result = entities.filter(e => e.id === id)

    if (result.length > 1) throw new Error('Got multiple entities for id ' + id)
    if (result.length == 0) throw new Error('No entities found for id ' + id)

    return result[0]
  }

  // add a message to the buffer
  message(msg: string) {
    const { messages, playerTurns } = this.state
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
    const t = this.active.terrainGrid.get(here)
    if (t === null) return false
    const opaqueEntities = this.get('tagBlocksLight', 'position').filter(e => e.position.s === here.s).length === 0
    return opaqueEntities && TerrainNumMap[t].transparent
  }

  // currently unused, may be useful for debug
  EntityComponentException<C extends Components>(error: string, entity: Entity, component: C | C[]) {
    console.error(error)
    objLog(component, 'component')
    objLog(entity, 'target')
    objLog(this.getByID(entity.id), 'probably')
    console.groupCollapsed('all entities')
    objLog(this.active.entities, 'all', true)
    console.groupEnd()
  }

  // entity modifier
  modify(e: Entity) {
    return modify(this.active, e)
  }
}

const modify = (active: Level, target: Entity) => {
  const newEntity = active.entities.find(e => e === target)
  if (!newEntity) throw new Error('modify: cannot locate' + target.id)
  let entity = newEntity

  const add = <C extends Components>(c: C) => {
    // check it did not already exist
    if (componentName(c) in entity) throw new Error(`add: Already has component ${entity.id} ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)

    console.log(`modify: add ${componentName(c)} to ${entity.id}`)
    return { entity, add, change, remove }
  }

  const change = <C extends Components>(c: C) => {
    // check it currently does exist
    if (!(componentName(c) in entity)) throw new Error(`change: ${entity.id} does not have ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)

    console.log(`modify: update ${entity.id} ${componentName(c)}`)
    return { entity, add, change, remove }
  }

  const remove = <N extends keyof Components>(cName: N) => {
    // check it currently does exist
    if (!(cName in entity)) throw new Error(`remove: ${entity.id} does not have ${cName}`)

    Reflect.deleteProperty(entity, cName)
    updateState(entity)

    console.log(`modify: remove ${entity.id} ${cName}`)
    return { entity, add, change, remove }
  }

  const updateState = (entity: Entity) => {
    const index = active.entities.findIndex(e => e.id === entity.id)
    if (index < 0) throw new Error(`modify: Cannot find ID ${entity.id}`)
    active.entities[index] = entity
  }

  return { entity, add, change, remove }
}

// font test
// this.message('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
// this.message('abcdefghijklmn opqrstuvwxyz')
// this.message('1234 567890')
