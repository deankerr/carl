// The central, immutable (??) repository for all game world state (but not World??? level?? Are they just interfaces?)
// The plan: lives in mutable form in here only, Object.freeze on everything handed out

// state.entities['monster-5']. .. ?

// * State is the only truth. everything else only exists for each turn cycle
// * none or very few instanced objects actually needed?
import { Entity } from './Entity'
// import * as Component from './Components'
import { copy, str } from './util/util'
import { Grid } from './Core/Grid'

// type StateObject = {
// entities: Record<string, string> // ? what am i trying to record?
//   [key: string]: Entity[]
// }

type Level2 = {
  label: string
  entities: Entity[]
  terrain: Grid<number>
}

export type StateObject = {
  activeLevel: Level2
  entityCount: number
  level: Level2
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
  stateIce

  constructor(initialState: StateObject) {
    this.__state = initialState

    console.log('this.__state:', this.__state)
    log('Start')

    console.groupCollapsed('deepFreeze')
    this.stateIce = this.deepFreeze(copy(this.__state))
    console.groupEnd()
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

  // TODO only pass in what we need to. most state wont change, eg terrain almost never except when changing level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deepFreeze(obj: any) {
    console.log('start', obj)
    Object.keys(obj).forEach((prop) => {
      if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
        this.deepFreeze(obj[prop])
      }
    })
    return Object.freeze(obj)
  }
}
// the "get" method seems impossible, try having a public frozen state
// OR return the entire object
// get() {
//   return this.state[key]
// }
