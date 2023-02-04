import { Engine } from '../Core'
import { Queue } from '../lib/util'

export function processRegionInitialization(engine: Engine) {
  // (re)initialize turn queue, with the player first
  const { local } = engine

  const player = local.player()
  const actors = local.get('actor').filter(a => !a.playerControlled)

  const queue = new Queue<number>()
  queue.add(player.eID, true)
  actors.forEach(a => queue.add(a.eID, true))

  local.turnQueue = queue

  local.entity(player).modify('tag', 'signalUpdatePlayerFOV')
}
