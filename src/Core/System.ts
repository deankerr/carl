import { CONFIG } from '../config'
import { logger } from '../lib/logger'
import {
  handleBump,
  handleLocationChange,
  handleMeleeAttack,
  handleMovement,
  handlePickUp,
  handleTread,
  processDeath,
  processFieldOfVision,
  processHeatMap,
  processRegionInitialization,
  renderMessageLog,
  renderRegion,
} from '../System'
import * as Action from './Action'

import { handlePortal } from '../System/handlePortal'
import { ActionTypes, Engine, Entity, Region } from './'

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
    processHeatMap,
  ]

  regionChangeProcess = [
    handleLocationChange,
    processRegionInitialization,
    processFieldOfVision,
    processHeatMap,
  ]

  renderProcess = [renderRegion, renderMessageLog]

  constructor(readonly engine: Engine) {}

  run(engine: Engine, playerAction: ActionTypes) {
    const log = logger('sys', 'runTurns')
    const { local } = engine

    let e = local.player() as Entity

    let maxLoops = 500
    while (maxLoops-- > 0) {
      log.msg('Start turn:', e.label)

      const action = e.playerControlled ? playerAction : Action.__randomMove()
      local.modify(e).define('acting', action)

      this.turnProcess.forEach(sys => sys(engine, e.playerControlled == true))

      local.modify(local.get('acting')[0]).remove('acting')

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
