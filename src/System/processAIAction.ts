import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const processAIAction = (engine: Engine, isPlayerTurn: boolean) => {
  if (isPlayerTurn) return

  const { local } = engine
  const [eActing] = local.get('acting')

  if (!eActing.friendly) {
    local.modify(eActing).define('acting', Action.__randomMove())
  }
}
