import { Point } from '../Model/Point'

export type Position = { position: Point }
export const position = (pt: Point): Position => {
  return { position: pt }
}
