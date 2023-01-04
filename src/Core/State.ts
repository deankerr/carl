// The central, immutable (currently not enforced) repository for all game world state

import { Entity } from './Entity'
import { Level } from '../Model/Level'
import { objLog } from '../util/util'
import { Dungeon4Data } from '../Generate/dungeon4/dungeon4'

type TurnMessages = [number, string[]]

export type StateObject = {
  level: Level // Active level, reference to a level in levels[]
  entityCount: number
  playerTurns: number
  messages: TurnMessages[]
  levels: Level[]
  graveyard: string[] // list of entity IDs that have been removed, currently for debug only
}

// Config
const showLog = false

export class State {
  current: StateObject

  constructor(loadLevel?: Dungeon4Data) {
    // Create the initial state
    const initialLevel = Level.createInitial(loadLevel)

    const initialState = {
      level: initialLevel,
      entityCount: 0,
      playerTurns: -1,
      messages: [],
      levels: [initialLevel],
      graveyard: [],
    }

    this.current = initialState

    log('Initial', this.current)
  }

  /*
    State API
    Should define a limited API for how the state can change.
    - Currently has duplicate functionality/concept with World
  */

  // return the next entity id, increment
  nextEntityID() {
    log('nextEntityID: ' + this.current.entityCount, this.current)
    return this.current.entityCount++
  }

  addEntity(entity: Entity) {
    log('Add entity ' + entity.id, this.current)

    this.current.level.entities.push(entity)

    log('Result', this.current)
  }

  // updates an entity - ie. replaces the entity with a new one with the new component
  updateEntity(oldEntity: Entity, newEntity: Entity) {
    log('Update entity ' + oldEntity.id, this.current.level.entities)
    const all = this.current.level.entities
    let index = 0
    for (const entity of all) {
      if (entity === oldEntity) {
        all[index] = newEntity
        break
      }
      index++
    }
    log('Result', this.current.level.entities)
  }

  deleteEntity(entity: Entity) {
    log('Remove entity ' + entity.id, this.current.level.entities)
    const oldEntities = this.current.level.entities
    const newEntities = oldEntities.filter((e) => e !== entity)

    if (newEntities.length !== oldEntities.length - 1) {
      console.error('State - deleteEntity did not change array length')
      console.error(entity)
      console.error(oldEntities)
      console.error(newEntities)
      throw new Error()
    }

    this.current.level.entities = newEntities
    log('Remove entity ' + entity.id, this.current.level.entities)
  }

  increasePlayerTurns() {
    this.current.playerTurns++
  }
}

// TODO better log solution
const stateLog: string[] = []
function log(s: string, state: object) {
  stateLog.unshift('State: ' + s)
  if (!showLog) return
  console.groupCollapsed(stateLog[0])
  objLog(state)
  console.groupEnd()
}
