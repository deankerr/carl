import { BaseGraphic } from './Graphic'

export type CycleGraphic = { cycleGraphic: BaseGraphic[] }

export const cycleGraphic = (graphics: BaseGraphic[]): CycleGraphic => {
  return { cycleGraphic: graphics }
}
