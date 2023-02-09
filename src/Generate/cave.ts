/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { Region } from '../Core'
import { floor, loop, pick, repeat, rnd, shuffle } from '../lib/util'
import { Point, point } from '../Model/Point'
import { Rect } from '../Model/Rectangle'
import { flameKeys, flameVariants } from '../Templates/flames'
import { CellDish } from './modules/cellular'
import { rndCluster, floodWalkable } from './modules/flood'
import { hop } from './modules/walk'
import { Overseer2 } from './Overseer2'

export function cave(width = CONFIG.mainDisplayWidth, height = CONFIG.mainDisplayHeight) {
  const region = new Region(width, height, window.game.pool)
  const O2 = new Overseer2(region)

  region.name = 'cave'

  //* cave generation
  const wall = 'caveSolid'
  const floor = 'dirtFloor'
  const water = 'water'
  const sand = 'sand'

  const clear = '[clear]'
  const web = 'web'

  const caveDish = new CellDish(region.rect)
  caveDish.addAlways(region.rect.edgePoints())
  caveDish.randomize(45).alive(pt => O2.terrain(pt, 'caveSolid'))
  O2.snapshot('cell init')

  caveDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 1')

  caveDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 2')

  caveDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 3')

  caveDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 4')

  caveDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? wall : floor))
  O2.snapshot('cell 5')

  //* lake
  const lakeSeed = rndCluster(5, O2.module())
  const lakeSeed2 = rndCluster(5, O2.module())
  const lakeDish = new CellDish(region.rect)

  region.rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) lakeDish.neverCells.add(pt)
  })
  lakeDish.addAlways([...lakeSeed, ...lakeSeed2]).alive(pt => O2.terrain(pt, water))
  O2.snapshot('lake seed')

  // grow
  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 1')
  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 2')
  lakeDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 3')

  // cell gen
  lakeDish.cull(30)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('cull')
  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 4')
  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 5')
  lakeDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? water : floor))
  O2.snapshot('lake 6')

  //* web
  const webSeed = rndCluster(5, O2.module())
  const webSeed2 = rndCluster(5, O2.module())
  const webDish = new CellDish(region.rect)

  region.rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) webDish.neverCells.add(pt)
  })
  webDish.addAlways([...webSeed, ...webSeed2]).alive(pt => O2.feature(pt, web))
  O2.snapshot('lake seed')

  // grow
  webDish.generation(0, 0)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 1')
  webDish.generation(0, 0)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 2')
  webDish.generation(0, 0)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 3')

  // cell gen
  webDish.cull(30)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('cull')
  webDish.generation(4, 5)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 4')
  webDish.generation(4, 5)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 5')
  webDish.generation(4, 5)((pt, alive) => O2.feature(pt, alive ? web : clear))
  O2.snapshot('lake 6')

  //* sand
  const sandSeed = rndCluster(5, O2.module())
  const sandSeed2 = rndCluster(5, O2.module())
  const sandDish = new CellDish(region.rect)

  region.rect.traverse(pt => {
    if (region.terrainAt(pt).blocksMovement) sandDish.neverCells.add(pt)
  })
  sandDish.addAlways([...sandSeed, ...sandSeed2]).alive(pt => O2.terrain(pt, sand))
  O2.snapshot('lake seed')

  // grow
  sandDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 1')
  sandDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 2')
  sandDish.generation(0, 0)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 3')

  // cell gen
  sandDish.cull(30)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('cull')
  sandDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 4')
  sandDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 5')
  sandDish.generation(4, 5)((pt, alive) => O2.terrain(pt, alive ? sand : floor))
  O2.snapshot('lake 6')

  const lakePts = shuffle(lakeDish.alivePoints())
  loop(6, () => {
    const pt = lakePts.pop()
    if (pt) O2.feature(pt, pick(['lilypad1', 'lilypad2', 'lilypad3', 'lilypad4']))
  })
  O2.snapshot('lilypads')

  const webPts = shuffle(webDish.alivePoints())
  loop(6, () => {
    const pt = webPts.pop()
    if (pt) O2.being(pt, pick(['spiderRed', 'spiderBlack']))
  })
  O2.snapshot('spiders')

  const sandPts = shuffle(sandDish.alivePoints())
  loop(4, () => {
    const pt = sandPts.pop()
    if (pt) O2.being(pt, pick(['scorpionRed', 'scorpionBlack']))
  })
  loop(4, () => {
    const pt = sandPts.pop()
    if (pt) O2.feature(pt, 'cactus')
  })
  O2.snapshot('scorpions')

  O2.finalize()
  return region
}
