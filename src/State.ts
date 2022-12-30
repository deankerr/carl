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
    const initialLevel = Level.createInitial()

    const initialState = {
      activeLevel: initialLevel,
      entityCount: 0,
      levels: [initialLevel],
    }

    this.__state = initialState

    console.log('initialState:', this.__state)

    this.current = this.__state

    log('Start', this.__state, this.current)
  }

  nextEntityCount() {
    log('nextEntityCount: ' + this.__state.entityCount, this.__state, this.current)
    return this.__state.entityCount++
  }

  // TODO just genertic updates to records
  // Should I just remake Redux?
  addEntity(entity: Entity) {
    log('Add entity ' + entity.id, this.__state, this.current)
    // add entity id here ?
    entity.id += '-' + this.nextEntityCount() // ! mutate param bad no
    this.__state.activeLevel.entities.push(entity)
    log('Done', this.__state, this.current)
  }

  updateEntity(entity: Entity) {
    log('Update entity', this.__state, this.current)
    const allEntities = this.__state.activeLevel.entities
    for (const ent of allEntities) {
      if (ent.id !== entity.id) continue
      console.log('found ent')
      console.table(ent)
      console.log('new ent')
      console.table(entity)
      const index = allEntities.findIndex((e) => e === ent)
      allEntities[index] = entity
      console.log('updated')
      this.__state.activeLevel.entities[index]
      break
    }
    log('Done ?', this.__state, this.current)
  }
}

// TODO better log solution
const stateLog: string[] = []
function log(s: string, state: StateObject, current: DeepReadonly<StateObject>) {
  stateLog.unshift(s)
  // console.log('stateLog:', stateLog[0])
  console.group(stateLog[0])
  // console.log(stateLog)
  console.log('state.__state', state)
  console.log('state.current', current)
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