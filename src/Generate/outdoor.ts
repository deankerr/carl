// import * as ROT from 'rot-js'
import { Level } from '../Model/Level'
import { Grid } from '../Model/Grid'
import { EntityTemplate, NewLevel } from './generate'
import { half, rnd, repeat } from '../util/util'
import { Point, Pt } from '../Model/Point'

// 48, 25
export const outdoor = (width = 48, height = 25): NewLevel => {
  console.log('createOutdoor')
  const level = Grid.fill(width, height, 98)

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

  // TODO rnd flip n/s weighting
  // a few northern peaks
  repeat(() => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, half(northQuartile.y)), 30, 14)
  }, 12)

  // a few northern mounds
  repeat(() => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, half(northQuartile.y)), 30, 13)
  }, 8)

  // the same but southern, and a bit less
  // peaks
  repeat(() => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, southQuartile.y + half(height - southQuartile.y)), 20, 14)
  }, 8)

  // mounds
  repeat(() => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, southQuartile.y + half(height - southQuartile.y)), 20, 13)
  }, 1)

  // a western lake
  repeat(() => {
    const rPt = level.rndPt()
    drawCluster(Pt(rnd(0, westQuartile.x), rPt.y), 80, 3)
  }, 1)

  // debug quartile markers
  level.set(northQuartile, 1)
  level.set(southQuartile, 1)
  level.set(westQuartile, 1)
  level.set(eastQuartile, 1)

  // stairs down
  const stairPt = center
  level.set(stairPt, 11)

  // some ghosts
  const entities: EntityTemplate[] = []
  repeat(() => entities.push(['ghost', center]), 4)

  return [new Level('outdoor', level, new Map(), []), entities]

  //  "CreatingAForest" roguebasin
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
}
