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

export class State {
  __state: StateObject
  current: DeepReadonly<StateObject>

  constructor() {
    const initialLevel = Level.createInitial()

    const initialState = {
      activeLevel: initialLevel,
      entityCount: 0,
      levels: [initialLevel],
    }

    this.__state = initialState

    console.log('initialState:', this.__state)
    log('Start')

    this.current = this.__state
  }

  nextEntityCount() {
    log('nextEntityCount' + this.__state.entityCount)
    return this.__state.entityCount++
  }

  // TODO just genertic updates to records
  // Should I just remake Redux?
  addEntity(entity: Entity) {
    log('Add entity ' + entity.id)
    this.__state.activeLevel.entities.push(entity)
    console.log(this.__state.activeLevel.entities)
  }
}

// TODO better log solution
const stateLog: string[] = []
function log(s: string) {
  stateLog.unshift(s)
  console.log('stateLog:', s)
  console.log(stateLog)
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
