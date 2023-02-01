import { ChangeRegion, Engine } from '../Core'
import { logger } from '../lib/logger'
import { Queue } from '../lib/util'
import * as Generate from '../Generate'

export function handleRegionChange(engine: Engine, action: ChangeRegion) {
  const log = logger('sys', 'handleRegionChange')

  const to = action.changeRegion.to

  const index = to === 'initial' ? 0 : engine.regions.findIndex(r => r === engine.local)
  if (index < 0) throw new Error('I am very lost.')

  const where: Record<string, number> = {
    down: 1,
    up: -1,
    initial: 0,
  }

  const next = index + where[to] ?? -1
  log.msg(`here: ${index}, next: ${to} ${next}`)
  if (next < 0) return log.end(`You can't go there.`)

  if (!engine.regions[next]) {
    // Generate new region
    log.msg('Generating new region')
    const newRegion = Generate.overworld().current
    engine.local = newRegion
    engine.regions[next] = newRegion
  } else {
    engine.local = engine.regions[next]
  }

  // (re)initialize turn queue, with the player first
  const { local } = engine
  const player = local.player()
  const actors = local.get('actor').filter(a => !a.playerControlled)

  const queue = new Queue<number>()
  queue.add(player.eID, true)
  actors.forEach(a => queue.add(a.eID, true))

  local.turnQueue = queue

  log.end('Region change complete')
}
