import { Move } from './Move'
import { UI } from './UI'
import { Bump } from './Bump'
import { MeleeAttack } from './MeleeAttack'
import { Tread } from './Tread'
import { ChangeLevel } from './ChangeLevel'
import { None } from './None'

export type ActionTypes = Move | UI | Bump | MeleeAttack | Tread | ChangeLevel | None

export function actionName(action: ActionTypes) {
  if (!action) return 'null'
  return Reflect.ownKeys(action).join()
}
