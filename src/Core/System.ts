import { CONFIG } from '../config'
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
  turnTimeHistory: number[] = []

  regionChangeProcess = [
    handleLocationChange,
    processRegionInitialization,
    processFieldOfVision,
    processHeatMap,
  ]

  renderProcess = [renderRegion, renderMessageLog]
  renderTimeHistory: number[] = []

  constructor(readonly engine: Engine) {}

  run(engine: Engine, playerAction: ActionTypes) {
    const t = performance.now()
    const { local } = engine

    let e = local.player() as Entity

    let maxLoops = 500
    while (maxLoops-- > 0) {
      const action = e.playerControlled ? playerAction : Action.__randomMove()
      local.modify(e).define('acting', action)

      this.turnProcess.forEach(sys => sys(engine, e.playerControlled == true))

      local.modify(local.get('acting')[0]).remove('acting')

      e = this.next(local)
      if (e.playerControlled) {
        this.turnTimeHistory.push(performance.now() - t)
        return
      }
    }

    if (maxLoops < 1) throw new Error('Sys loop maximum exceeded')
  }

  next(local: Region) {
    const nextID = local.turnQueue.next()
    if (nextID === undefined) throw new Error('System: turn queue empty')
    return local.getByID(nextID)
  }

  render(engine: Engine) {
    if (!engine.local.hasChanged) return

    const t = performance.now()
    this.renderProcess.forEach(sys => sys(engine))
    this.renderTimeHistory.push(performance.now() - t)
  }

  init() {
    this.change(Action.ChangeZone(CONFIG.initialZone))
  }

  change(change?: ActionTypes) {
    this.regionChangeProcess.forEach(sys => sys(this.engine, true, change))
  }
}
