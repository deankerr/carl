/* eslint-disable @typescript-eslint/no-unused-vars */
import { CONFIG } from '../config'
import { Region } from '../Core'
import { loop, pick, shuffle } from '../lib/util'
import { Point } from '../lib/Shape/Point'
import { CellDish } from './modules/cellular'
import { floodFindRegions } from './modules/flood'
import { Overseer3 } from './Overseer3'

export function cave(width = CONFIG.generateWidth, height = CONFIG.generateHeight) {
  const region = new Region(width, height)
  const O3 = new Overseer3(region)

  region.name = 'cave'

  //* cave generation
  const wall = 'caveWall'
  const floor = 'dirtFloor'
  const water = 'water'
  const sand = 'sand'

  const clear = '[clear]'
  const web = 'web'

  const caveDish = new CellDish(region.rect)
  caveDish.addAlways(region.rect.edgePoints())
  caveDish.randomize(45).current((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell init')

  caveDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell 1')

  caveDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell 2')

  caveDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell 3')

  caveDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell 4')

  caveDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? wall : floor))
  O3.snap('cell 5')

  // //* lake
  // const lakeSeed = rndCluster(5, O3.module())
  // const lakeSeed2 = rndCluster(5, O3.module())
  // const lakeDish = new CellDish(region.rect)

  // region.rect.traverse(pt => {
  //   if (region.terrainAt(pt).blocksMovement) lakeDish.neverCells.add(pt)
  // })
  // lakeDish.addAlways([...lakeSeed, ...lakeSeed2]).alive(pt => O3.add(pt, water))
  // O3.snap('lake seed')

  // // grow
  // lakeDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 1')
  // lakeDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 2')
  // lakeDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 3')

  // // cell gen
  // lakeDish.cull(30)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('cull')
  // lakeDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 4')
  // lakeDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 5')
  // lakeDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? water : floor))
  // O3.snap('lake 6')

  // //* web
  // const webSeed = rndCluster(1, O3.module())
  // const webSeed2 = rndCluster(1, O3.module())
  // const webDish = new CellDish(region.rect)

  // region.rect.traverse(pt => {
  //   if (region.terrainAt(pt).blocksMovement) webDish.neverCells.add(pt)
  // })
  // webDish.addAlways([...webSeed, ...webSeed2]).alive(pt => O3.feature(pt, web))
  // O3.snap('lake seed')

  // // grow
  // webDish.generation(0, 0)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 1')
  // webDish.generation(0, 0)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 2')
  // webDish.generation(0, 0)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 3')

  // // cell gen
  // webDish.cull(90)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('cull')
  // webDish.generation(4, 5)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 4')
  // webDish.generation(4, 5)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 5')
  // webDish.generation(4, 5)((pt, alive) => O3.feature(pt, alive ? web : clear))
  // O3.snap('lake 6')

  // //* sand
  // const sandSeed = rndCluster(5, O3.module())
  // const sandSeed2 = rndCluster(5, O3.module())
  // const sandDish = new CellDish(region.rect)

  // region.rect.traverse(pt => {
  //   if (region.terrainAt(pt).blocksMovement) sandDish.neverCells.add(pt)
  // })
  // sandDish.addAlways([...sandSeed, ...sandSeed2]).alive(pt => O3.add(pt, sand))
  // O3.snap('lake seed')

  // // grow
  // sandDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 1')
  // sandDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 2')
  // sandDish.generation(0, 0)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 3')

  // // cell gen
  // sandDish.cull(30)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('cull')
  // sandDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 4')
  // sandDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 5')
  // sandDish.generation(4, 5)((pt, alive) => O3.add(pt, alive ? sand : floor))
  // O3.snap('lake 6')

  // const lakePts = shuffle(lakeDish.alivePoints())
  // loop(6, () => {
  //   const pt = lakePts.pop()
  //   if (pt) O3.feature(pt, pick(['lilypad1', 'lilypad2', 'lilypad3', 'lilypad4']))
  // })
  // O3.snap('lilypads')

  // const webPts = shuffle(webDish.alivePoints())
  // loop(6, () => {
  //   const pt = webPts.pop()
  //   if (pt) O3.being(pt, pick(['spiderRed', 'spiderBlack']))
  // })
  // O3.snap('spiders')

  // const sandPts = shuffle(sandDish.alivePoints())
  // loop(4, () => {
  //   const pt = sandPts.pop()
  //   if (pt) O3.being(pt, pick(['scorpionRed', 'scorpionBlack']))
  // })
  // loop(4, () => {
  //   const pt = sandPts.pop()
  //   if (pt) O3.feature(pt, 'cactus')
  // })
  // O3.snap('scorpions')

  // floodFindRegions(region.rect, (pt: Point) => !region.terrainAt(pt).blocksMovement)

  O3.finalize()
  return region
}
