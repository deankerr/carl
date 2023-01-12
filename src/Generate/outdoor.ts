import * as ROT from 'rot-js'
import { Level } from '../Model/Level'
import { Grid } from '../Model/Grid'
import { NewLevel } from './generate'
import { half, rnd, repeat } from '../util/util'
import { Point, Pt } from '../Model/Point'

export const outdoor = (width = 36, height = 36): NewLevel => {
  console.log('createOutdoor')

  const level = Grid.fill(width, height, 0)
  const center = Pt(half(width), half(height))

  // tree test
  // level.each((pt, _v) => {
  //   rnd(1) && level.set(pt, 12)
  // })

  //  "CreatingAForest" roguebasin
  drawForest(center)
  repeat(() => {
    drawForest(level.rndPt())
  }, 10)

  function drawForest(pt: Point) {
    let xi = pt.x
    let yi = pt.y

    for (let k = 1; k <= 20; k++) {
      const n = rnd(5)
      const e = rnd(5)
      const s = rnd(5)
      const w = rnd(5)

      if (n === 1) {
        xi--
        level.set(Pt(xi, yi), 12)
      }

      if (s === 1) {
        xi++
        level.set(Pt(xi, yi), 12)
      }

      if (e === 1) {
        yi--
        level.set(Pt(xi, yi), 12)
      }

      if (w === 1) {
        yi++
        level.set(Pt(xi, yi), 12)
      }
    }
  }

  return [new Level('outdoor', level, new Map(), []), []]
}
