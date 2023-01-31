import {
  handleBump,
  handleMeleeAttack,
  handleMovement,
  handleTread,
  processDeath,
  processFieldOfVision,
  renderMessageLog,
  renderRegion,
  processFormUpdate,
  processLighting,
} from '../System'
import { Region } from './Region'
import * as Action from './Action'
import { ActionTypes } from './Action'
import { Engine } from './Engine'
import { logger } from '../lib/logger'

export class System {
  localInitProcess = [processFieldOfVision]

  turnProcess = [
    handleMovement,
    handleTread,
    handleBump,
    handleMeleeAttack,
    processDeath,
    processFieldOfVision,
  ]
  // postTurnProcess = []

  preRenderProcess = [processFormUpdate, processLighting]
  renderProcess = [renderRegion, renderMessageLog]

  player(engine: Engine, playerAction: ActionTypes) {
    const log = logger('sys', 'runPlayerTurn')

    log.msg('runTurn Player')
    engine.local.entity(engine.local.player()).modify('acting', playerAction)
    this.turnProcess.forEach(sys => sys(engine, true))
    engine.local.entity(engine.local.get('acting')[0]).remove('acting')

    this.run(engine)
    log.end()
  }

  run(engine: Engine) {
    const log = logger('sys', 'runTurns')
    const { local } = engine
    let maxLoops = 100
    while (maxLoops-- > 0) {
      const e = this.next(local)
      if (e.playerControlled) {
        log.msg('Sys: Player Input Required')
        // this.postTurnProcess.forEach(sys => sys(engine))
        return
      }
      log.msg('runTurn', e.label)

      local.entity(e).modify('acting', Action.__randomMove())
      this.turnProcess.forEach(sys => sys(engine, false))
      local.entity(local.get('acting')[0]).remove('acting')
    }
    if (maxLoops < 1) throw new Error('Sys loop maximum exceeded')
  }

  // process(region: Region) {}

  next(local: Region) {
    const nextID = local.turnQueue.next()
    if (nextID === undefined) throw new Error('System: turn queue empty')
    return local.getByID(nextID)
  }

  runRender(engine: Engine) {
    const log = logger('sys', 'runRender')
    this.preRenderProcess.forEach(sys => sys(engine))
    this.renderProcess.forEach(sys => sys(engine))
    log.end()
  }

  runLocalInit(engine: Engine) {
    this.localInitProcess.forEach(sys => sys(engine))
  }
}
