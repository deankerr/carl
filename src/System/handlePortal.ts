import { Engine } from '../Core/Engine'
import * as Action from '../Core/Action'

export const handlePortal = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [eActing] = local.get('acting', 'position')
  if (!eActing) return
  const { acting: action } = eActing

  if (!('usePortal' in action)) return

  const [tHere] = local.at(eActing.position)

  if (tHere.portal) {
    console.log('portal action')
    engine.system.change(Action.ChangeLocation(tHere.portal.zone, tHere.portal.level))
  } else {
    console.log('No portal here')
  }
}
