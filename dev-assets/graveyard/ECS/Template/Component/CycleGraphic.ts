import { Graphic } from './Graphic'

export type CycleGraphic = { cycleGraphic: { list: Graphic[]; frequency: number; current: number; lastUpdate: number } }

export const cycleGraphic = (list: Graphic[], frequency: number, current = -1, lastUpdate = 0): CycleGraphic => {
  return { cycleGraphic: { list, frequency, current, lastUpdate } }
}
