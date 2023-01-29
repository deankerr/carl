// import * as Sys from '../System'
import { handleMovement } from '../System'
import { Region } from './Region'
import * as Action from '../Action'
import { ActionTypes } from '../Action'

export class System {
  entityTurn = [handleMovement]
  playerInputRequired = false

  turn(region: Region, playerAction: ActionTypes) {
    const { component } = window.game
    const nextID = region.turnQueue.next()
    if (!nextID) throw new Error('System: turn queue empty')
    console.log('nextID:', nextID)
    const e = region.getByID(nextID)
    if (!e) throw new Error('System: unable to get entity by ID')

    region.modify(e, component.acting(Action.none()))
    console.log('next turn:', e)
    if (e.tags.includes('playerControlled')) {
      console.log('Sys: player turn')
      this.playerInputRequired = true
      return
    }
  }
}
