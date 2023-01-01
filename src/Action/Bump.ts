// (temp?) action that represents an actor bumping into a coordinate
// display message, attack entity, etc

import { Point } from '../Model/Point'

export type Bump = { bump: Point }

export const bump = (pt: Point): Bump => {
  return { bump: pt }
}
