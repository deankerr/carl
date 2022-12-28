// Set up the initial game state
import * as Generate from './generate'
import { StateObject } from '../State'

export function initialState(): StateObject {
  console.log('Initial game state')

  const grid = Generate.dungeon4()

  const level = { label: 'init', entities: [], terrain: grid }

  const init = {
    activeLevel: level,
    entityCount: 0,
    level,
  }

  return init
}
