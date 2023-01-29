import { Point } from '../Model/Point'

export type Position = { cID: 'position'; position: Point }
export function position(pt: Point): Position {
  return { cID: 'position', position: pt }
}
