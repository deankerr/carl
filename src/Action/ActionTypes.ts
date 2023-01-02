import { Move } from './Move'
import { UI } from './UI'
import { Bump } from './Bump'
import { MeleeAttack } from './MeleeAttack'

export type ActionTypes = null | Move | UI | Bump | MeleeAttack

export function actionName(action: ActionTypes) {
  if (!action) return 'null'
  return Reflect.ownKeys(action).join()
}
