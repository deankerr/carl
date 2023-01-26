// Entity/Component manager
import { Game } from './Game'
import { Entity, EntityTemplate, hydrate } from './Entity'
import { Components, componentName } from './Components'
import { Graphic, tagCurrentTurn } from '../Component'
import { Beings, TerrainTemplate, Domains, Domain } from '../Templates'
import { Level } from '../Model/Level'
import { Point, Pt, strToPt } from '../Model/Point'
import { objLog } from '../lib/util'
import { colorizeMessage, Message } from '../lib/messages'

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export class World {
  options: Game['options']
  terrain = new Map<TerrainTemplate, Entity>()

  hasChanged = true // trigger a rerender on next animation frame

  // Game state
  domains = Domains
  domain: Domain
  active: Level
  activeIndex = 0
  messages: Message[] = [] // TODO rename messageLog
  playerTurns = -1 // TODO start on 0
  nextEntityID = 0

  constructor(options: Game['options']) {
    this.options = options

    // initialize world structure, set root level as active
    this.domain = this.domains[0]
    this.active = this.domain.levels[0]

    this.setCurrentLevel(this.domain, 0)

    this.message('You begin your queste.')
  }

  //  World API - Everything that happens in the game should occur through this API.

  setCurrentLevel(domain: Domain, index: number) {
    // generate a level if it does not yet exist
    if (!domain.levels[index]) {
      console.log('create', domain.id, index)
      const overseer = domain.generator()

      const level = new Level(domain.id, overseer.grid)
      level.overseer = overseer

      domain.levels.push(level)
      this.active = domain.levels[index]
      this.activeIndex = index
      this.domain = domain
      overseer.mutators.forEach(m => {
        for (const [pt, template] of m.divulge().entities) {
          this.createTemplate(template, strToPt(pt))
        }
      })
      // this.createTemplates(entityTemplates)
      this.createPlayer()
    } else {
      console.log('change', domain.id, index)
      this.active = domain.levels[index]
      this.activeIndex = index
      this.domain = domain
    }
    this.hasChanged = true
  }

  changeLevel(dir: number) {
    console.log('changeLevel:', dir)
    const nextIndex = this.activeIndex + dir < 0 ? 0 : this.activeIndex + dir
    this.setCurrentLevel(this.domain, nextIndex)
  }

  createTemplate(template: EntityTemplate, pt: Point) {
    if (template.id === 'player') this.createPlayer(pt)
    else {
      const entity = hydrate(template, pt)
      this.activate(entity)
    }
  }

  createPlayer(pt?: Point) {
    if (this.get('tagPlayer').length > 0) return
    const player = this.activate(
      hydrate(Beings.player, pt ?? this.active.stairsAscendingPt ?? this.active.ptInRoom(), this.domain.playerFOV)
    )
    this.active.scheduler.add(player.id, true)
  }

  // add new entity to state
  activate(entity: Entity) {
    // stamp with next id
    const id = entity.id + '-' + this.nextEntityID++
    const newEntity = { ...entity, id }
    this.active.entities.push(newEntity)
    if ('tagActor' in entity) this.active.scheduler.add(newEntity.id, true)
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
    if ('tagBlocksLight' in t) return false
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

  __clog(collapse = false) {
    collapse ? console.groupCollapsed('World') : console.group('World')
    console.log('domain', this.domain)
    console.log('active', this.active)
    console.log('activeIndex', this.activeIndex)
    console.log('messages', this.messages)
    console.log('playerTurns', this.playerTurns)
    console.log('nextEntityID', this.nextEntityID)
    console.log('terrain:', this.terrain)
    console.groupEnd()
  }
}

const modify = (active: Level, target: Entity) => {
  // let log = true
  const newEntity = active.entities.find(e => e === target)
  if (!newEntity) throw new Error('modify: cannot locate' + target.id)
  let entity = newEntity

  const add = <C extends Components | Graphic>(c: C) => {
    // check it did not already exist
    if (componentName(c) in entity) throw new Error(`add: Already has component ${entity.id} ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)

    // log && console.log(`modify: add ${componentName(c)} to ${entity.id}`)
    return { entity, add, change, remove }
  }

  const change = <C extends Components | Graphic>(c: C) => {
    // check it currently does exist
    const isGraphic = 'char' in c && 'color' in c
    if (!isGraphic && !(componentName(c) in entity)) {
      throw new Error(`change: ${entity.id} does not have ${componentName(c)}`)
    }

    entity = { ...entity, ...c }
    updateState(entity)

    // log && console.log(`modify: update ${entity.id} ${componentName(c)}`)
    return { entity, add, change, remove }
  }

  const remove = <N extends keyof Components | keyof Graphic>(cName: N) => {
    // check it currently does exist
    if (!(cName in entity)) throw new Error(`remove: ${entity.id} does not have ${cName}`)

    Reflect.deleteProperty(entity, cName)
    updateState(entity)

    // log && console.log(`modify: remove ${entity.id} ${cName}`)
    return { entity, add, change, remove }
  }

  const updateState = (entity: Entity) => {
    const index = active.entities.findIndex(e => e.id === entity.id)
    if (index < 0) throw new Error(`modify: Cannot find ID ${entity.id}`)
    active.entities[index] = entity
  }

  // silence the usually useful console.logs for animation updates
  const noLog = () => {
    // log = false
    return { entity, add, change, remove }
  }

  return { entity, add, change, remove, noLog }
}

// font test
// this.message('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
// this.message('abcdefghijklmn opqrstuvwxyz')
// this.message('1234 567890')
