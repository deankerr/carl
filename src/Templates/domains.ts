import * as Generate from '../Generate'
import { Region } from '../Core'

export type Domain = {
  label: string
  generator: (width?: number, height?: number) => Region
  regions: Region[]
  current: number
}

export const atlas: Domain[] = [
  { label: 'desert', generator: Generate.desert, regions: [], current: 0 },
  { label: 'graveyard', generator: Generate.overworld, regions: [], current: 0 },
  { label: 'dungeon', generator: Generate.dungeon, regions: [], current: 0 },
]

export function initialLocation() {
  return atlas[0].regions[0]
}

// const start = 1
