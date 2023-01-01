import { Move } from './Move'
import { UI } from './UI'

export type ActionTypes = Move | UI | null

export function actionName(action: ActionTypes) {
  if (!action) return 'null'
  return Reflect.ownKeys(action).join()
}
