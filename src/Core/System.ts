import { CONFIG } from '../config'
import { logger } from '../lib/logger'
import {
  handleBump,
  handleMeleeAttack,
  handleMovement,
  handleTread,
  processDeath,
  processFieldOfVision,
  processLighting,
  renderMessageLog,
  renderRegion,
  handleLocationChange,
  processRegionInitialization,
  handlePickUp,
} from '../System'
import * as Action from './Action'

import { ActionTypes, Engine, Entity, Region } from './'
import { handlePortal } from '../System/handlePortal'

export class System {
  turnProcess = [
    handlePortal,
    handlePickUp,
    handleMovement,
    handleTread,
    handleBump,
    handleMeleeAttack,
    processDeath,
    processFieldOfVision,
  ]

  regionChangeProcess = [handleLocationChange, processRegionInitialization, processFieldOfVision]

  preRenderProcess = [processLighting]
  renderProcess = [renderRegion, renderMessageLog]

  constructor(readonly engine: Engine) {}

  run(engine: Engine, playerAction: ActionTypes) {
    const log = logger('sys', 'runTurns')
    const { local } = engine

    let e = local.player() as Entity

    let maxLoops = 500
    while (maxLoops-- > 0) {
      const action = e.playerControlled ? playerAction : Action.__randomMove()

      log.msg('Start turn:', e.label)
      local.entity(e).modify('acting', action)
      this.turnProcess.forEach(sys => sys(engine, e.playerControlled == true))
      local.entity(local.get('acting')[0]).remove('acting')

      e = this.next(local)

      if (e.playerControlled) return log.end('Sys: Player Input Required')
    }

    if (maxLoops < 1) throw new Error('Sys loop maximum exceeded')
  }

  next(local: Region) {
    const nextID = local.turnQueue.next()
    if (nextID === undefined) throw new Error('System: turn queue empty')
    return local.getByID(nextID)
  }

  render(engine: Engine) {
    const log = logger('sys', 'runRender')
    this.preRenderProcess.forEach(sys => sys(engine))
    this.renderProcess.forEach(sys => sys(engine))
    log.end()
  }

  init() {
    this.change(Action.ChangeZone(CONFIG.initialZone))
  }

  change(change: ActionTypes) {
    this.regionChangeProcess.forEach(sys => sys(this.engine, true, change))
  }
}
