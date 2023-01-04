// Stand on a walkable entity
import { Point } from '../Model/Point'

export type Tread = { tread: Point }

export const Tread = (pt: Point): Tread => {
  return { tread: pt }
}
