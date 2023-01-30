// import * as Sys from '../System'
import { handleBump, handleMeleeAttack, handleMovement, handleTread, processDeath } from '../System'
import { Region } from './Region'
import * as Action from './Action'
import { ActionTypes } from './Action'

export class System {
  turnProcess = [handleMovement, handleTread, handleBump, handleMeleeAttack, processDeath]

  player(local: Region, playerAction: ActionTypes) {
    console.group('player')

    local.entity(local.player()).modify('acting', playerAction)
    this.turnProcess.forEach(sys => sys(local, true))
    local.entity(local.get('acting')[0]).remove('acting')

    console.groupEnd()

    this.run(local)
  }

  run(local: Region) {
    let maxLoops = 100
    while (maxLoops-- > 0) {
      const e = this.next(local)
      if (e.playerControlled) {
        console.log('Sys: Player Input Required')
        return
      }

      console.groupCollapsed('Sys:', e.label)
      local.entity(e).modify('acting', Action.__randomMove())
      this.turnProcess.forEach(sys => sys(local, false))
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
}
