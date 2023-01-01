import { Move } from './Move'
import { UI } from './UI'
import { Bump } from './Bump'

export type ActionTypes = Move | UI | Bump | null

export function actionName(action: ActionTypes) {
  if (!action) return 'null'
  return Reflect.ownKeys(action).join()
}
