export const DIRECTIONS = {
  NW: 'NORTH-WEST',
  N: 'NORTH',
  NE: 'NORTH-EAST',
  W: 'WEST',
  WAIT: 'WAIT',
  E: 'EAST',
  SW: 'SOUTH-WEST',
  S: 'SOUTH',
  SE: 'SOUTH-EAST',
} as const

export type Direction = keyof typeof DIRECTIONS
