import * as Generate from '../Generate'
import { Overseer } from '../Generate'
import { Level } from '../Model/Level'

export type Domain = {
  id: string
  playerFOV: number
  generator: () => Overseer
  connections: string[]
  levels: Level[]
}

const overworld: Domain = {
  id: 'overworld',
  playerFOV: 12,
  generator: Generate.overworld,
  connections: ['dungeon'],
  levels: [],
}

const dungeon: Domain = {
  id: 'dungeon',
  playerFOV: 8,
  generator: Generate.dungeon,
  connections: ['overworld'],
  levels: [],
}

export const Domains = [overworld, dungeon]
