// Entity/Component manager
import { Components, componentName } from './Components'
import { tagCurrentTurn } from '../Component'
import { Entity, hydrateBeing, hydrateFeature, createPlayer, EntityTemplates, createDoor } from './Entity'
import { objLog } from '../lib/util'
import { Point, Pt } from '../Model/Point'
import { Game } from './Game'
import { Level } from '../Model/Level'
import { colorizeMessage, Message } from '../lib/messages'
import { RootOfTheWorld, TheWorld } from '../Templates/TheWorld'

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export class World {
  active: Level
  activeIndex = 0
  options: Game['options']

  // Game state
  domains = TheWorld
  activeDomain: typeof this.domains[keyof typeof this.domains]
  messages: Message[] = [] // TODO rename messageLog
  playerTurns = -1 // TODO start on 0
  nextEntityID = 0

  constructor(options: Game['options']) {
    this.options = options

    this.domains = TheWorld

    this.active = this.domains[RootOfTheWorld].levels[0]
    this.activeDomain = this.domains[RootOfTheWorld]

    this.setCurrentLevel(this.activeDomain, 0)

    this.message('You begin your queste.')
  }

  //  World API - Everything that happens in the game should occur through this API.

  setCurrentLevel(location: typeof this.domains[keyof typeof this.domains], index: number) {
    // generate a level if it does not yet exist
    console.log('set level:', location.label, index, location)
    if (index > location.levels.length - 1) {
      console.log('world create level', location.generator)
      const [level, entityTemplates] = location.generator()

      location.levels.push(level)
      this.active = location.levels[index]

      this.createTemplates(entityTemplates)
      this.createPlayer()
    } else {
      console.log('world change level')
      this.active = location.levels[index]
    }
  }

  changeLevel(dir: string) {
    let nextIndex: number
    if (dir === 'descend') {
      nextIndex = this.activeIndex + 1
    } else if (dir === 'ascend') {
      nextIndex = this.activeIndex - 1
    } else {
      throw new Error('Invalid level change')
    }

    let nextDomain: typeof this.domains[keyof typeof this.domains]
    if (nextIndex < 0) {
      // change domain
      // TODO temp
      nextDomain = this.activeDomain.bottom as typeof this.activeDomain
      nextIndex = 0
    } else if (dir === 'descend') {
      nextDomain = this.activeDomain.descend as typeof this.activeDomain
      nextIndex = 0
    } else if (dir === 'ascend') {
      nextDomain = this.activeDomain.ascend as typeof this.activeDomain
      nextIndex = 0
    } else {
      nextDomain = this.activeDomain
      nextIndex = 0
    }

    this.setCurrentLevel(nextDomain, nextIndex)
  }

  createTemplates(newTemplates: EntityTemplates) {
    if (newTemplates.features) {
      for (const feature of newTemplates.features) {
        const [t, pos] = feature
        this.create(hydrateFeature(t, pos === 0 ? this.active.ptInRoom() : pos))
      }
    }

    if (newTemplates.doors) {
      for (const pt of newTemplates.doors) {
        this.create(createDoor(pt))
      }
    }

    if (newTemplates.beings) {
      for (const being of newTemplates.beings) {
        const [t, pos] = being
        const entity = this.create(hydrateBeing(t, pos === 0 ? this.active.ptInRoom() : pos))
        if ('tagActor' in entity) this.active.scheduler.add(entity.id, true)
      }
    }

    if (newTemplates.player) {
      const pt = newTemplates.player
      this.createPlayer(pt)
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
    const id = entity.id + '-' + this.nextEntityID++
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
  here(pt: Point): [Entity, Entity[]] {
    const terrain = this.active.terrain(pt)
    // pretend its a wall if out of bounds?
    // ? endless void should be fine
    // const terrain = t !== null ? TerrainNumMap[t] : TerrainNumMap[99]
    const entities = this.get('position')
    const entitiesHere = entities.filter(e => Pt(e.position.x, e.position.y).s === pt.s) as Entity[]

    return [terrain, entitiesHere]
  }

  // hereWith<Key extends keyof Entity>(pt: Point, ...components: Key[]): [TerrainType, EntityWith<Entity, Key>[]] {
  //   const t = this.active.terrainGrid.get(pt)
  //   // pretend its a wall if out of bounds?
  //   const terrain = t !== null ? TerrainNumMap[t] : TerrainNumMap[1]
  //   const entitiesHere = this.get('position').filter(e => e.position.s === pt.s) as Entity[]
  //   const entitiesWith = entitiesHere.filter(e => components.every(name => name in e)) as EntityWith<Entity, Key>[]
  //   return [terrain, entitiesWith]
  // }

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
  }

  nextTurn() {
    console.log('this.active:', this.active)
    const prev = this.get('tagCurrentTurn')
    if (prev.length > 1) throw new Error('Multiple entities with current turn')
    // if (prev.length === 0) console.log('No tagCurrentTurn found')
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
  message(newMsg: string) {
    const { messages } = this
    const colors = colorizeMessage(newMsg)

    // add to existing buffer for this turn
    if (messages.length > 0 && messages[0].turn === this.playerTurns) {
      messages[0].colors = [...messages[0].colors, ...colors]
      messages[0].raw += ' ' + newMsg
    }
    // new buffer for this turn
    else messages.unshift({ turn: this.playerTurns, colors, raw: newMsg })
  }

  isTransparent(x: number, y: number) {
    const here = Pt(x, y)
    const t = this.active.terrain(here)
    if (t.tagBlocksLight) return false
    const opaqueEntities = this.get('tagBlocksLight', 'position').filter(e => e.position.s === here.s).length === 0
    return opaqueEntities
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
