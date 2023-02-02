import { logger } from '../lib/logger'
import {
  handleBump,
  handleMeleeAttack,
  handleMovement,
  handleRegionChange,
  handleTread,
  processDeath,
  processFieldOfVision,
  processFormUpdate,
  processLighting,
  renderMessageLog,
  renderRegion,
  handleDomainChange,
  processRegionGeneration,
  processRegionInitialization,
} from '../System'
import * as Action from './Action'

import { ActionTypes, Engine, Region } from './'

export class System {
  turnProcess = [
    handleMovement,
    handleTread,
    handleBump,
    handleMeleeAttack,
    processDeath,
    processFieldOfVision,
  ]

  regionChangeProcess = [
    handleDomainChange,
    handleRegionChange,
    processRegionGeneration,
    processRegionInitialization,
    processFieldOfVision,
  ]

  preRenderProcess = [processFormUpdate, processLighting]
  renderProcess = [renderRegion, renderMessageLog]

  constructor(readonly engine: Engine) {}

  run(engine: Engine, playerAction: ActionTypes) {
    const log = logger('sys', 'runTurns')
    const { local } = engine

    let playerTurnTaken = false
    let maxLoops = 100

    while (maxLoops-- > 0) {
      const e = this.next(local)

      if (e.playerControlled) {
        if (playerTurnTaken) return log.end('Sys: Player Input Required')
        else playerTurnTaken = true
      }

      const action = e.playerControlled ? playerAction : Action.__randomMove()

      log.msg('Start turn:', e.label)
      local.entity(e).modify('acting', action)
      this.turnProcess.forEach(sys => sys(engine, e.playerControlled == true))
      local.entity(local.get('acting')[0]).remove('acting')
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
    this.change(Action.none())
  }

  change(change: ActionTypes) {
    this.regionChangeProcess.forEach(sys => sys(this.engine, change))
  }
}
