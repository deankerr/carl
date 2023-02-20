import { Engine } from '../Core/Engine'

export const processHeatMap = (engine: Engine, isPlayerTurn: boolean) => {
  const { local } = engine

  if (!isPlayerTurn) return

  const player = local.player()
  if (!player.signalPlayerMoved) return

  local.heatMap.calculate(player.position)
  local.modify(player).remove('signalPlayerMoved')

  if (engine.options.showHeatMap) {
    local.heatMap.each((pt, val) => {
      local.debugSymbol(pt, val, val)
    })
  }
}
