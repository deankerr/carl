import * as ROT from 'rot-js'
import { Level } from '../Model/Level'
import { Grid } from '../Model/Grid'
import { NewLevel } from './generate'
import { half, rnd, repeat } from '../util/util'
import { Point, Pt } from '../Model/Point'

export const outdoor = (width = 36, height = 25): NewLevel => {
  console.log('createOutdoor')
  const level = Grid.fill(width, height, 0)

  const center = Pt(half(width), half(height))
  const northQuartile = Pt(center.x, half(center.y))
  const southQuartile = Pt(center.x, center.y + half(center.y))
  const westQuartile = Pt(half(center.x), center.y)
  const eastQuartile = Pt(center.x + half(center.x), center.y)

  // place a lot of grass
  repeat(() => {
    drawCluster(level.rndPt(), 100, 8)
  }, 40)

  // place some dead grass
  repeat(() => {
    drawCluster(level.rndPt(), 40, 9)
  }, 20)

  // a few mounds
  repeat(() => {
    drawCluster(level.rndPt(), 40, 13)
  }, 20)

  // a few peaks
  repeat(() => {
    drawCluster(level.rndPt(), 40, 14)
  }, 10)

  level.set(northQuartile, 1)
  level.set(southQuartile, 1)
  level.set(westQuartile, 1)
  level.set(eastQuartile, 1)

  // tree test
  // level.each((pt, _v) => {
  //   rnd(1) && level.set(pt, 12)
  // })

  //  "CreatingAForest" roguebasin
  // repeat(() => {
  //   drawCluster(level.rndPt(), 100, 12)
  // }, 1)

  function drawCluster(startPt: Point, amount: number, terrain: number) {
    let xi = startPt.x
    let yi = startPt.y

    for (let k = 1; k <= amount; k++) {
      const n = rnd(5)
      const e = rnd(5)
      const s = rnd(5)
      const w = rnd(5)

      if (n === 1) {
        yi--
        level.set(Pt(xi, yi), terrain)
      }

      if (e === 1) {
        xi++
        level.set(Pt(xi, yi), terrain)
      }

      if (s === 1) {
        yi++
        level.set(Pt(xi, yi), terrain)
      }

      if (w === 1) {
        xi--
        level.set(Pt(xi, yi), terrain)
      }
    }
  }

  return [new Level('outdoor', level, new Map(), []), []]
}
