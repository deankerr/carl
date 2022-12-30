// The central, immutable (??) repository for all game world state (but not World??? level?? Are they just interfaces?)
// The plan: lives in mutable form in here only, Object.freeze on everything handed out

// * State is the only truth. everything else only exists for each turn cycle
// * none or very few instanced objects actually needed?

import { Entity } from './Components'
import { Level } from './Level'
import { DeepReadonly } from 'ts-essentials'
/* 
  state object spec:

  export type TEST_StateObject = {
    activeLevel: Level
    entityCount: number
    levels: {
      label: string
      entities: Entity[]

    }
  }

*/

export type StateObject = {
  activeLevel: Level
  entityCount: number
  levels: Level[]
}

export type StateCurrent = DeepReadonly<StateObject>

export class State {
  __state: StateObject
  current: StateCurrent

  constructor() {
    // Create the initial state
    const initialLevel = Level.createInitial()

    const initialState = {
      activeLevel: initialLevel,
      entityCount: 0,
      levels: [initialLevel],
    }

    this.__state = initialState

    // Readonly typed to be read by the world
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

    this.__state.activeLevel.entities.push(entity)

    log('Result', this.__state)
  }

  updateEntity(oldEntity: Entity, newEntity: Entity) {
    log('Update entity', this.__state)
    const allEntities = this.__state.activeLevel.entities
    let index = -1
    for (const ent of allEntities) {
      index++
      if (ent !== oldEntity) continue
      allEntities[index] = newEntity
      break
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
