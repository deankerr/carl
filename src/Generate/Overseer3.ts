import { Region } from '../Core'
import { Rect } from '../Model/Rectangle'

export class Overseer3 {
  rect: Rect
  pool = window.game.pool

  timeStart = Date.now()
  timeEnd = 0

  constructor(readonly region: Region) {
    this.rect = region.rect
  }
}
