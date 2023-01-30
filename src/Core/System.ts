// import * as Sys from '../System'
import { handleBump, handleMeleeAttack, handleMovement, handleTread, processDeath } from '../System'
import { Region } from './Region'
import * as Action from '../Action'
import { ActionTypes } from '../Action'

export class System {
  turnProcess = [handleMovement, handleTread, handleBump, handleMeleeAttack, processDeath]

  player(region: Region, playerAction: ActionTypes) {
    console.group('player')

    region.entity(region.player()).modify('acting', playerAction)
    this.turnProcess.forEach(sys => sys(region, true))
    // region.remove(region.get('acting'), 'acting')
    region.entity(region.get('acting')[0]).remove('acting')
    console.groupEnd()
    this.run(region)
  }

  run(region: Region) {
    let maxLoops = 100
    while (maxLoops-- > 0) {
      const e = this.next(region)
      if (e.playerControlled) {
        console.log('Sys: Player Input Required')
        return
      }

      region.entity(e).modify('acting', Action.__randomMove())
      this.turnProcess.forEach(sys => sys(region, false))
      region.entity(region.get('acting')[0]).remove('acting')
    }
  }

  // process(region: Region) {}

  next(region: Region) {
    const nextID = region.turnQueue.next()
    if (!nextID) throw new Error('System: turn queue empty')
    return region.getByID(nextID)
  }
}
