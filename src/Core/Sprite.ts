import { pick, Queue, rnd, shuffle } from '../lib/util'
import { oryxTinyMap } from '../lib/tilemap'
import { Tag } from './Components'
import { Engine } from './Engine'

export type SpriteConfig = {
  base: string[]
  ledge?: string[]
  build?: string
  animate?: [AnimType, number]
  trigger?: Tag[]
  noise?: number[]
  exposed?: string[]
}

export type Sprites = {
  base: Sprite
  type: AnimType
  speed: number
  trigger?: Tag[]
  noise?: number[]
  ledge?: Sprite
  north?: Sprite
  east?: Sprite
  south?: Sprite
  west?: Sprite
  exposed?: Sprite
}

type AnimType = 'static' | 'cycle' | 'random'

export class SpriteManager {
  all = new Map<string, Sprite>()
  animated = new Map<number, Sprite[]>()

  constructor(readonly engine: Engine) {}

  register(config: SpriteConfig): Sprites {
    const [animType, animSpeed] = config.animate ?? ['static', 0]

    if (config.build) return this.build(config.build, animType, animSpeed)

    const base = this.sprite(config.base, animType, animSpeed)
    const sprites: Sprites = { base, type: animType, speed: animSpeed }

    if (config.ledge) sprites.ledge = this.sprite(config.ledge, animType, animSpeed)
    if (config.exposed) sprites.exposed = this.sprite(config.exposed, animType, animSpeed)
    if (config.trigger) sprites.trigger = config.trigger
    if (config.noise) sprites.noise = config.noise

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

    tiles.forEach(t => {
      if (!oryxTinyMap[t]) throw new Error(`Unknown tile: ${t}`)
    })

    const sprite = new Sprite(tiles, animType, animSpeed)
    this.all.set(hash, sprite)

    if (animType !== 'static') {
      const list = this.animated.get(animSpeed) ?? []
      list.push(sprite)
      this.animated.set(animSpeed, list)

      if (list.length === 1) {
        this.animate(animSpeed)
      }
    }

    return sprite
  }

  animate(animSpeed: number) {
    const list = this.animated.get(animSpeed)
    if (!list) return

    list.forEach(s => s.next())
    if (this.engine.local) this.engine.local.hasChanged = true

    setTimeout(this.animate.bind(this), animSpeed, animSpeed)
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
  }

  cycle() {
    const next = this.cycleQ.next()
    if (!next) return

    this.tile = next
  }

  random() {
    const next = rnd(this.tiles.length - 1)
    this.tile = this.tiles[next]
  }

  next() {
    if (this.type === 'cycle') this.cycle()
    if (this.type === 'random') this.random()
  }
}
