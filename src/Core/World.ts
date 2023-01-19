// Entity/Component manager
import { Game } from './Game'
import { Entity, EntityTemplates, hydrate } from './Entity'
import { Components, componentName } from './Components'
import { Graphic, tagCurrentTurn } from '../Component'
import { Beings, Features } from '../Templates'
import { createDomains, Domain, DomainMap } from '../Generate/domains'
import { Level } from '../Model/Level'
import { Point, Pt } from '../Model/Point'
import { objLog } from '../lib/util'
import { colorizeMessage, Message } from '../lib/messages'

export type EntityWith<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export class World {
  options: Game['options']

  // Game state
  domainMap: DomainMap
  domain: Domain
  active: Level
  activeIndex = 0

  messages: Message[] = [] // TODO rename messageLog
  playerTurns = -1 // TODO start on 0
  nextEntityID = 0

  constructor(options: Game['options']) {
    this.options = options

    // initialize world structure, set root level as active
    const [domainMap, root] = createDomains()
    this.domainMap = domainMap
    this.domain = root
    this.setCurrentLevel(this.domain, 0)
    this.active = this.domain.levels[0]

    this.message('You begin your queste.')
  }

  //  World API - Everything that happens in the game should occur through this API.

  setCurrentLevel(domain: Domain, index: number) {
    // generate a level if it does not yet exist
    if (index > domain.levels.length - 1) {
      console.log('create', domain?.label, index)
      const [level, entityTemplates] = domain.generator()

      domain.levels.push(level)
      this.active = domain.levels[index]
      this.activeIndex = index
      this.domain = domain

      this.createTemplates(entityTemplates)
      this.createPlayer()
    } else {
      console.log('change', domain?.label, index)
      this.active = domain.levels[index]
      this.activeIndex = index
      this.domain = domain
    }
  }

  changeLevel(dir: number) {
    console.log('changeLevel:', dir)
    let nextDomain: Domain | undefined
    let nextIndex: number | undefined

    const { top, ascend, descend, bottom } = this.domain.connections

    // descend
    if (dir === 1) {
      console.log('changeLevel down')
      if (descend) {
        if (descend !== this.domain) {
          console.log('changeLevel descend domain')
          // descend to another domain
          nextDomain = descend
          nextIndex = 0
          // ????
        } else if (this.activeIndex === 50 && bottom) {
          console.log('changeLevel bottom')
          // descend out of dungeon
          nextDomain = bottom
          nextIndex = 0
        } else {
          console.log('changeLevel descend')
          nextDomain = descend
          nextIndex = this.activeIndex + 1
        }
      }
    }

    // ascend
    if (dir === -1) {
      console.log('changeLevel up')
      if (ascend) {
        if (ascend !== this.domain) {
          console.log('changeLevel ascend domain')
          // ascend to another domain
          nextDomain = ascend
          nextIndex = 0
        } else if (this.activeIndex === 0 && top) {
          console.log('changeLevel top')
          // ascend out of dungeon
          nextDomain = top
          nextIndex = 0
        } else {
          console.log('changeLevel ascend ')
          nextDomain = ascend
          nextIndex = this.activeIndex - 1
        }
      }
    }

    console.log('changelevel to:', nextDomain, nextIndex)
    if (!nextDomain || nextIndex === undefined) throw new Error('Could not determine where to go')

    this.setCurrentLevel(nextDomain, nextIndex)
  }

  // TODO Can be greatly simplified after Generate refactor
  createTemplates(newTemplates: EntityTemplates) {
    if (newTemplates.features) {
      for (const feature of newTemplates.features) {
        const [t, pos] = feature
        this.create(hydrate(t, pos === 0 ? this.active.ptInRoom() : pos))
      }
    }

    if (newTemplates.doors) {
      for (const pt of newTemplates.doors) {
        this.create(hydrate(Features.door, pt))
      }
    }

    if (newTemplates.beings) {
      for (const being of newTemplates.beings) {
        const [t, pos] = being
        const entity = this.create(hydrate(t, pos === 0 ? this.active.ptInRoom() : pos))
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
    const player = this.create(
      hydrate(Beings.player, pt ?? this.active.stairsAscendingPt ?? this.active.ptInRoom(), this.domain.playerFOV)
    )
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
    console.log('domainMap', this.domainMap)
    console.log('domain', this.domain)
    console.log('active', this.active)
    console.log('activeIndex', this.activeIndex)
    console.log('messages', this.messages)
    console.log('playerTurns', this.playerTurns)
    console.log('nextEntityID', this.nextEntityID)
    console.groupEnd()
  }
}

const modify = (active: Level, target: Entity) => {
  const newEntity = active.entities.find(e => e === target)
  if (!newEntity) throw new Error('modify: cannot locate' + target.id)
  let entity = newEntity

  const add = <C extends Components | Graphic>(c: C) => {
    // check it did not already exist
    if (componentName(c) in entity) throw new Error(`add: Already has component ${entity.id} ${componentName(c)}`)

    entity = { ...entity, ...c }
    updateState(entity)

    console.log(`modify: add ${componentName(c)} to ${entity.id}`)
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

    console.log(`modify: update ${entity.id} ${componentName(c)}`)
    return { entity, add, change, remove }
  }

  const remove = <N extends keyof Components | keyof Graphic>(cName: N) => {
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
