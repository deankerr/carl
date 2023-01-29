// import * as Sys from '../System'
import { handleBump, handleMeleeAttack, handleMovement, handleTread, processDeath } from '../System'
import { Region } from './Region'
import * as Action from '../Action'
import { ActionTypes } from '../Action'

export class System {
  turnProcess = [handleMovement, handleTread, handleBump, handleMeleeAttack, processDeath]

  player(region: Region, playerAction: ActionTypes) {
    const { component } = window.game
    console.group('player')
    region.modify(region.player(), component.acting(playerAction))
    this.turnProcess.forEach(sys => sys(region, true))
    region.remove(region.get('acting'), 'acting')
    console.groupEnd()
    this.run(region)
  }

  run(region: Region) {
    let maxLoops = 100
    while (maxLoops-- > 0) {
      const e = this.next(region)
      if (e.tags.includes('playerControlled')) {
        console.log('Sys: Player Input Required')
        return
      }

      const { component } = window.game

      region.modify(e, component.acting(Action.__randomMove()))
      this.turnProcess.forEach(sys => sys(region, false))
      region.remove(region.get('acting'), 'acting')
    }
  }

  // process(region: Region) {}

  next(region: Region) {
    const nextID = region.turnQueue.next()
    if (!nextID) throw new Error('System: turn queue empty')
    return region.getByID(nextID)
  }
}
