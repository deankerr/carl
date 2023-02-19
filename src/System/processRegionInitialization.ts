import { CONFIG } from '../config'
import { Engine } from '../Core'
import { Queue } from '../lib/util'

export function processRegionInitialization(engine: Engine) {
  // (re)initialize turn queue, with the player first
  const { local } = engine

  const player = local.player() ?? local.createPlayer()

  const actors = local.get('actor').filter(a => !a.playerControlled)

  const queue = new Queue<number>()
  queue.add(player.eID, true)
  actors.forEach(a => queue.add(a.eID, true))

  local.turnQueue = queue

  local.modify(player).define('tag', 'signalUpdatePlayerFOV')

  if (CONFIG.setMainToMapSize)
    engine.mainDisplay.setOptions({ width: local.width, height: local.height })
}
