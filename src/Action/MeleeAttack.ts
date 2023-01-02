import { Point } from '../Model/Point'

export type MeleeAttack = { meleeAttack: Point }

export const MeleeAttack = (pt: Point): MeleeAttack => {
  return { meleeAttack: pt }
}
