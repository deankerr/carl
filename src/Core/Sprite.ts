/* 

being sprite - facing - SpriteF4
  - auto build from entity key
  - same for all - 4 directions of 2 anim frames
  - cycle
  ? made up of individual animated units
  ? system to update current render as?

liquid sprite - SpriteL
  - ledge variant
  - some 6, some 4. different animation types
  - random - ? individual??

other anim: campfire, torch

? support adding shadow to terrain sprites?
? wall/floor noise sprites?

- processSpriteUpdate
  responds to hasChanged + region init
  selects facing/ledge (/noise?)

goblin: {
  tile: ['goblinE1'],
  facingSprite: ['goblin', 1000],
}


*/

import { Queue } from '../lib/util'

const templt = {
  goblin: {
    name: 'goblin',
    sprite: ['directional', 750, 'goblin'], // spriteman constructs directional anim sprite
  },

  goblin2: {
    sprite: {
      facing: 'goblin',
      animate: ['cycle', 750],
    },
  },

  dungwall: {
    sprite: {
      noise: ['dungWall1', 'dungWall2', 'dungWall3'],
    },
  },
}

/* 
  Sys SpriteUpdates (?)
  on hasChanged + region init check
    - FACING
      check current facing dir (stored where?)
    - LEDGE
      check ledge condition (above is different entity)
    - NOISE?
*/

export type SpriteConfig = {
  base: string[]
  ledge?: string[]
  animate?: [AnimType, number]
  // noise: string[]
  // noiseChance: number[]
}

export type Sprites = {
  current: Sprite
  base: Sprite
  ledge?: Sprite
}

type AnimType = 'static' | 'cycle' | 'random'

export class SpriteManager {
  all = new Map<string, Sprite>()

  register(config: SpriteConfig) {
    console.log('==== sm register: ====')
    console.log(config)

    const [animType, animSpeed] = config.animate ?? ['static', 0]

    const base = this.sprite(config.base, animType, animSpeed)
    const current = base
    const sprites: Sprites = { current, base }

    if (config.ledge) sprites.ledge = this.sprite(config.ledge, animType, animSpeed)

    return sprites
  }

  hash(tiles: string[], animType: AnimType, animSpeed: number) {
    return animType + '-' + animSpeed + '-' + tiles.join('-')
  }

  sprite(tiles: string[], animType: AnimType, animSpeed: number) {
    const hash = this.hash(tiles, animType, animSpeed)
    const cached = this.all.get(hash)
    if (cached) return cached

    const sprite = new Sprite(tiles, animType, animSpeed)
    this.all.set(hash, sprite)
    return sprite
  }
}

let spriteID = 0

export class Sprite {
  sID = spriteID++
  tile: string

  cycleQ = new Queue<string>()

  constructor(readonly tiles: string[], readonly type: AnimType, readonly speed: number) {
    this.tile = tiles[0]

    if (this.type === 'cycle' && this.speed) {
      tiles.forEach(t => this.cycleQ.add(t, true))
      this.cycle()
    }

    console.log('new sprite:', this)
  }

  cycle() {
    const next = this.cycleQ.next()
    if (!next) return

    this.tile = next
    setTimeout(this.cycle.bind(this), this.speed)
  }
}
