import { Graphic } from './Graphic'

export type CycleGraphic = { cycleGraphic: Graphic[] }

export const cycleGraphic = (list: Graphic[]): CycleGraphic => {
  return { cycleGraphic: list }
}
