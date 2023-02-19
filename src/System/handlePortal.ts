import * as Action from '../Core/Action'
import { Engine } from '../Core/Engine'

export const handlePortal = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine
  const [eActing] = local.get('acting', 'position')
  if (!eActing) return
  const { acting: action } = eActing

  if (!('usePortal' in action)) return

  const [pHere] = local.at(eActing.position).filter(e => e.portal)

  if (pHere?.portal) {
    engine.system.change(Action.ChangeLocation(pHere.portal.zone, pHere.portal.level))
  } else {
    console.log('No portal here')
  }
}
