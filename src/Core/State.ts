// The central, immutable (currently not enforced) repository for all game world state

import { Entity } from './Components'
import { Level } from '../Model/Level'
import { actionName, ActionTypes } from '../Action'

export type StateObject = {
  level: Level // Active level, reference to a level in levels[]
  // entity: Entity | null // the entity currently taking their turn
  action: ActionTypes // the action currently being taken by the active entity (systems can update this) // ? make [] - record action history?
  entityCount: number
  levels: Level[]
}

// Config
const showLog = false

export class State {
  current: StateObject

  constructor() {
    // Create the initial state
    const initialLevel = Level.createInitial()

    const initialState = {
      level: initialLevel,
      entity: null,
      action: null,
      entityCount: 0,
      levels: [initialLevel],
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
    log('Update entity ' + oldEntity.id, this.current)
    const all = this.current.level.entities
    let index = 0
    for (const entity of all) {
      if (entity === oldEntity) {
        all[index] = newEntity
        break
      }
      index++
    }
    log('Result', this.current)
  }

  // set the current action being evaluated during system process
  updateAction(action: ActionTypes) {
    const prevAction = this.current.action
    this.current.action = action
    console.log(`STATE UPDATE_ACTION '${actionName(prevAction)}' -> '${actionName(action)}'`)
  }
}

// TODO better log solution
const stateLog: string[] = []
function log(s: string, state: StateObject) {
  stateLog.unshift('State: ' + s)
  if (!showLog) return
  console.groupCollapsed(stateLog[0])
  console.log(state)
  console.groupEnd()
}
