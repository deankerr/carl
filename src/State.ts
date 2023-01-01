// The central, immutable (??) repository for all game world state
// The plan: lives in mutable form in here only, Object.freeze on everything handed out

import { Entity } from './Components'
import { Level } from './Level'
import { DeepReadonly } from 'ts-essentials'

export type StateObject = {
  level: Level // Active level, reference to a level in levels[]
  entityCount: number
  levels: Level[]
}

export type StateCurrent = DeepReadonly<StateObject>

export class State {
  current: StateObject

  constructor() {
    // Create the initial state
    const initialLevel = Level.createInitial()

    const initialState = {
      level: initialLevel,
      entityCount: 0,
      levels: [initialLevel],
    }

    this.current = initialState

    log('Initial', this.current)
  }

  // === "Reducers" ===

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
    log('Update entity ' + oldEntity.id, this.current)
    // console.table(oldEntity)
    const all = this.current.level.entities
    let index = 0
    for (const entity of all) {
      if (entity === oldEntity) {
        all[index] = newEntity
        break
      }
      index++
    }

    // log('Result', this.current)
    // console.table(newEntity)
  }
}

const showLog = false
// TODO better log solution
const stateLog: string[] = []
function log(s: string, state: StateObject) {
  stateLog.unshift('State: ' + s)
  if (!showLog) return
  console.groupCollapsed(stateLog[0])
  console.log(state)
  console.groupEnd()
}
