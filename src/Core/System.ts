import {
  handleBump,
  handleMeleeAttack,
  handleMovement,
  handleTread,
  processDeath,
  processFieldOfVision,
  renderMessageLog,
  renderRegion,
} from '../System'
import { Region } from './Region'
import * as Action from './Action'
import { ActionTypes } from './Action'
import { Engine } from './Engine'

export class System {
  localInitProcess = [processFieldOfVision]
  turnProcess = [handleMovement, handleTread, handleBump, handleMeleeAttack, processDeath, processFieldOfVision]
  renderProcess = [renderRegion, renderMessageLog]

  player(engine: Engine, playerAction: ActionTypes) {
    console.group('player')

    engine.local.entity(engine.local.player()).modify('acting', playerAction)
    this.turnProcess.forEach(sys => sys(engine, true))
    engine.local.entity(engine.local.get('acting')[0]).remove('acting')

    console.groupEnd()

    this.run(engine)
  }

  run(engine: Engine) {
    const { local } = engine
    let maxLoops = 100
    while (maxLoops-- > 0) {
      const e = this.next(local)
      if (e.playerControlled) {
        console.log('Sys: Player Input Required')
        return
      }

      console.groupCollapsed('Sys:', e.label)
      local.entity(e).modify('acting', Action.__randomMove())
      this.turnProcess.forEach(sys => sys(engine, false))
      local.entity(local.get('acting')[0]).remove('acting')
      console.groupEnd()
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
    this.renderProcess.forEach(sys => sys(engine))
  }

  runLocalInit(engine: Engine) {
    this.localInitProcess.forEach(sys => sys(engine))
  }
}
