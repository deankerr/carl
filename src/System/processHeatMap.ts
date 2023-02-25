import { Engine } from '../Core/Engine'
import { heatMapColor } from '../lib/color'
import { nAlpha } from '../lib/util'

export const processHeatMap = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine

  const player = local.player()
  if (!player.signalPlayerMoved) return

  local.heatMap.calculate(player.position)
  local.modify(player).remove('signalPlayerMoved')

  if (engine.options.showHeatMap) {
    local.heatMap.each((pt, val) => {
      local.debugSymbolMap.set(pt, [nAlpha(val), heatMapColor(val), 'transparent'])
    })
  }
}
