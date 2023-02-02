/* eslint-disable @typescript-eslint/no-unused-vars */ // !!!!! dev
import * as ROT from 'rot-js'
import { CONFIG } from '../config'
import { EntityKey, Region } from '../Core'
import { logger } from '../lib/logger'
import { half, pick, repeat, rnd } from '../lib/util'
import { point, Point, neighbours4 } from '../Model/Point'

export function desert(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const log = logger('generate', 'desert')

  const region = new Region(width, height, window.game.pool)
  region.voidColor = '#bba344'
  // region.voidColor = '#000'
  const center = point(half(width), half(height))

  function baseGrass() {
    const gen = walk(rndPoint())
    repeat(100, () => {
      region.createTerrain('deadGrass', gen.next().value)
    })
  }

  function scattered(key: EntityKey, start: Point) {
    const gen = jump(start, 5)
    repeat(10, () => {
      region.createTerrain(key, gen.next().value)
    })
  }

  repeat(10, baseGrass)

  repeat(10, () => {
    scattered('grass', rndPoint())
  })

  repeat(5, () => {
    scattered('deadTree', rndPoint())
  })

  repeat(10, () => {
    scattered('cactus', rndPoint())
  })

  repeat(10, () => {
    scattered('mound', rndPoint())
  })

  log.end()
  return region

  function rndPoint() {
    return point(rnd(0, width), rnd(0, height))
  }
}

function* walk(start: Point) {
  let pt = point(start.x, start.y)
  while (1) {
    yield (pt = pt.add(pick(neighbours4)))
  }
  return pt
}

function* jump(start: Point, mag: number) {
  let pt = point(start.x, start.y)

  while (1) {
    const dir = pick(neighbours4)
    pt = pt.add(dir.x * rnd(mag), dir.y * rnd(mag))
    yield pt
  }
  return pt
}
