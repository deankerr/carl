import { Move } from './Move'
import { UI } from './UI'
import { Bump } from './Bump'
import { MeleeAttack } from './MeleeAttack'
import { Tread } from './Tread'

export type ActionTypes = Move | UI | Bump | MeleeAttack | Tread

export function actionName(action: ActionTypes) {
  if (!action) return 'null'
  return Reflect.ownKeys(action).join()
}
