import { BaseGraphic } from './Graphic'

export type CycleGraphic = { cycleGraphic: { list: BaseGraphic[]; current: number } }

export const cycleGraphic = (list: BaseGraphic[], current = 0): CycleGraphic => {
  return { cycleGraphic: { list, current } }
}
