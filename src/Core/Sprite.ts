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

import { pick, Queue, rnd, shuffle } from '../lib/util'

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
  build?: string
  animate?: [AnimType, number]
  // noise: string[]
  // noiseChance: number[]
}

export type Sprites = {
  base: Sprite
  type: AnimType
  speed: number
  ledge?: Sprite
  north?: Sprite
  east?: Sprite
  south?: Sprite
  west?: Sprite
}

type AnimType = 'static' | 'cycle' | 'random'

export class SpriteManager {
  all = new Map<string, Sprite>()

  register(config: SpriteConfig): Sprites {
    // console.log('==== sm register: ====')
    // console.log(config)

    const [animType, animSpeed] = config.animate ?? ['static', 0]

    if (config.build) return this.build(config.build, animType, animSpeed)

    const base = this.sprite(config.base, animType, animSpeed)
    const sprites: Sprites = { base, type: animType, speed: animSpeed }

    if (config.ledge) sprites.ledge = this.sprite(config.ledge, animType, animSpeed)

    return sprites
  }

  build(key: string, animType: AnimType, animSpeed: number) {
    const north = this.sprite([key + 'N1', key + 'N2'], animType, animSpeed)
    const east = this.sprite([key + 'E1', key + 'E2'], animType, animSpeed)
    const south = this.sprite([key + 'S1', key + 'S2'], animType, animSpeed)
    const west = this.sprite([key + 'W1', key + 'W2'], animType, animSpeed)
    const base = pick([east, south, west])

    return { base, north, east, south, west, ssID: spritesID++, type: animType, speed: animSpeed }
  }

  hash(tiles: string[], animType: AnimType, animSpeed: number) {
    let hash = animType + '-' + animSpeed + '-' + tiles.join('-')
    if (animType === 'random') hash += '-' + rnd(20)
    return hash
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

let spritesID = 0

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

    if (this.type === 'random' && this.speed) {
      this.random()
    }

    // console.log('new sprite:', this)
  }

  cycle() {
    const next = this.cycleQ.next()
    if (!next) return

    this.tile = next
    setTimeout(this.cycle.bind(this), this.speed)
  }

  random() {
    const next = rnd(this.tiles.length - 1)
    this.tile = this.tiles[next]
    setTimeout(this.random.bind(this), this.speed)
  }

  clone() {
    return new Sprite(this.tiles, this.type, this.speed)
  }
}
