// The central, (not really) immutable repository for all game world state
import { Level } from '../Model/Level'

export type TurnMessages = [number, string[]]

export type StateObject = {
  active: Level // Active level, reference to a level in levels[]
  levels: Level[]
  nextID: number
  playerTurns: number
  messages: TurnMessages[]
  graveyard: string[] // list of entity IDs that have been removed, currently for debug only
}

export const createState = (initialLevel: Level): StateObject => {
  const initialState = {
    active: initialLevel,
    nextID: 0,
    playerTurns: -1,
    messages: [],
    levels: [initialLevel],
    graveyard: [],
  }

  // console.log('createState', initialState)
  return initialState
}
