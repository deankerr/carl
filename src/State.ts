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
  __state: StateObject
  current: StateCurrent // Readonly typed to be read by the world

  constructor() {
    // Create the initial state
    const initialLevel = Level.createInitial()

    const initialState = {
      level: initialLevel,
      entityCount: 0,
      levels: [initialLevel],
    }

    this.__state = initialState

    this.current = this.__state

    log('Initial', this.__state)
  }

  // === "Reducers" ===

  // return the next entity id, increment
  nextEntityID() {
    log('nextEntityID: ' + this.__state.entityCount, this.__state)
    return this.__state.entityCount++
  }

  addEntity(entity: Entity) {
    log('Add entity ' + entity.id, this.__state)

    this.__state.level.entities.push(entity)

    log('Result', this.__state)
  }

  // updates an entity - ie. replaces the entity with a new one with the new component
  updateEntity(oldEntity: Entity, newEntity: Entity) {
    log('Update entity ' + oldEntity.id, this.__state)

    const all = this.__state.level.entities
    let index = 0
    for (const entity of all) {
      if (entity === oldEntity) {
        all[index] = newEntity
        break
      }
      index++
    }

    log('Result', this.__state)
  }
}

// TODO better log solution
const stateLog: string[] = []
function log(s: string, state: StateObject) {
  stateLog.unshift('State: ' + s)
  console.groupCollapsed(stateLog[0])
  console.log(state)
  console.groupEnd()
}

// DeepReadonly is working for now
// // only pass in what we need to. most state wont change, eg terrain almost never except when changing level
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   private deepFreeze(obj: any) {
//     console.log('start', obj)
//     Object.keys(obj).forEach((prop) => {
//       if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
//         this.deepFreeze(obj[prop])
//       }
//     })
//     return Object.freeze(obj)
// }
