// The central, (not really) immutable repository for all game world state
import { Level } from '../Model/Level'
import { Dungeon4Data } from '../Generate/dungeon4/dungeon4'
import { CONFIG } from '../config'

type TurnMessages = [number, string[]]

export type StateObject = {
  level: Level // Active level, reference to a level in levels[]
  nextID: number
  playerTurns: number
  messages: TurnMessages[]
  levels: Level[]
  graveyard: string[] // list of entity IDs that have been removed, currently for debug only
}

export class State {
  current: StateObject

  constructor(loadLevel?: Dungeon4Data) {
    // Create the initial state
    let initialLevel
    switch (CONFIG.initialLevel) {
      default:
      case 'dungeon4':
        initialLevel = Level.createDungeon4(loadLevel)
        break
      case 'ruins1':
        initialLevel = Level.createRuin1()
        break
      case 'bigRoom':
        initialLevel = Level.createBigRoom()
    }

    const initialState = {
      level: initialLevel,
      nextID: 0,
      playerTurns: -1,
      messages: [],
      levels: [initialLevel],
      graveyard: [],
    }

    this.current = initialState

    console.log('Initial state', this.current)
  }
}
