import { Keys } from '../lib/Keys'
import { World } from './World'
// import { renderLevel, renderMessages } from './Render'

export class Visualizer {
  constructor(readonly world: World, readonly keys: Keys) {
    console.log('Visualizer init')
  }
}
