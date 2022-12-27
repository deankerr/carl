import { Move } from './Move'
import { Wait } from './Wait'
import { UI } from './UI'
import { ChangeLevel } from './ChangeLevel'
import { NewPlayerPos } from './NewPlayerPos'

export * from './Move'
export * from './Wait'
export * from './UI'
export * from './ChangeLevel'

export enum Actions {
  wait = 'WAIT',
  move = 'MOVE',
}

export type Action = Move | Wait | UI | ChangeLevel | NewPlayerPos

// export interface Actions:
