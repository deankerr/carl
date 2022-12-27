// The central, immutable (??) repository for all game world state (but not World??? level?? Are they just interfaces?)
// The plan: lives in mutable form in here only, Object.freeze on everything handed out

// state.entities['monster-5']. .. ?

// * State is the only truth. everything else only exists for each turn cycle
// * none or very few instanced objects actually needed?
import { Entity } from './Entity'
// import * as Component from './Components'
import { str } from './util/util'
import { Grid } from './Core/Grid'

// type StateObject = {
// entities: Record<string, string> // ? what am i trying to record?
//   [key: string]: Entity[]
// }

type leLvel = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
}

export type StateObject = {
  activeLevel: leLvel
  entityCount: number
  level: leLvel
}

// ? Think of a better solution
const stateLog: string[] = []
function log(s: string) {
  stateLog.unshift(s)
  console.log('stateLog:', s)
  console.log(stateLog)
}

export class State {
  __state

  // stateIce

  constructor(initialState: StateObject) {
    this.__state = initialState

    console.log('this.__state:', this.__state)
    log('Start')
    // this.stateIce = this.deepFreeze(copy(state))
    // this.stateIce.entities = []
  }

  nextEntityCount() {
    log('nextEntityCount' + this.__state.entityCount)
    return this.__state.entityCount++
  }

  // Should I just remake Redux?
  addEntity(entity: Entity) {
    log('Add entity' + str(entity.id))
    this.__state.level.entities.push(entity)
    console.log(this.__state.activeLevel.entities)
  }

  // deepFreeze<T>(stateCopy: T): T {
  //   const keys = Reflect.ownKeys(stateCopy)
  //   console.log('stateCopy:', stateCopy)
  //   console.log('keys:', keys)

  //   for (const name of keys) {
  //     console.log('STATE name:', name)
  //     const value = stateCopy[name]

  //     if ((value && typeof value === 'object') || typeof value === 'function') {
  //       this.deepFreeze(value)
  //     }
  //   }

  //   return Object.freeze(stateCopy)
  // }
}
// the "get" method seems impossible, try having a public frozen state
// OR return the entire object
// get() {
//   return this.state[key]
// }
