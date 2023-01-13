// import * as ROT from 'rot-js'
import { Level } from '../Model/Level'
import { Grid } from '../Model/Grid'
import { EntityTemplate, NewLevel } from './generate'
import { half, rnd, repeat } from '../util/util'
import { Point, Pt } from '../Model/Point'
import { outdoorRuin } from './prefab/outdoorRuin'

// 48, 25
export const outdoor = (width = 48, height = 25): NewLevel => {
  console.log('createOutdoor')
  const level = Grid.fill(width, height, 98)
  const entities: EntityTemplate[] = []

  const center = Pt(half(width), half(height))
  const northQuartile = Pt(center.x, half(center.y))
  const southQuartile = Pt(center.x, center.y + half(center.y))
  const westQuartile = Pt(half(center.x), center.y)
  // const eastQuartile = Pt(center.x + half(center.x), center.y)

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

  // a western lake/shrubs
  const lakePtW = Pt(rnd(0, westQuartile.x), level.rndPt().y)
  drawCluster(lakePtW, 40, 15) // shrub
  drawCluster(lakePtW, 80, 3) // water

  // a southern lake/shrubs
  const lakePtS = Pt(level.rndPt().x, rnd(southQuartile.y, height - 1))
  drawCluster(lakePtS, 10, 15) // shrub
  drawCluster(lakePtS, 20, 3) // water

  // ruin at center
  const ruinWidth = outdoorRuin[0].length
  const ruinHeight = outdoorRuin.length
  const offset = Pt(2, 0)
  const ruinPt = Pt(center.x - half(ruinWidth) + offset.x, center.y - half(ruinHeight) + offset.y)
  const ruinKey: { [key: string]: number } = {
    '#': 1,
    '%': 2,
    d: 11,
    v: 98,
    ' ': -1, // skip
  }

  outdoorRuin.forEach((row, yi) => {
    row.split('').forEach((col, xi) => {
      const here = Pt(ruinPt.x + xi, ruinPt.y + yi)
      if (col === '+') {
        entities.push(['door', here])
        level.set(here, 98)
      } else if (col === 'm') {
        // remove mounds/peaks, leave grass
        const t = level.get(here)
        if (t === 13 || t === 14) level.set(here, 98)
      } else if (col === 'S') {
        // a skellybones
        entities.push(['skeleton', here])
        level.set(here, 98)
      } else {
        const t = ruinKey[col] ?? -1
        if (t > -1) level.set(here, t)

        // center marker (tree)
        // if (xi === half(ruinWidth) && yi === half(ruinHeight)) level.set(here, 12)
      }
    })
  })

  // stairs down (now set in prefab)
  // const stairPt = center
  // level.set(stairPt, 11)

  // some ghosts
  repeat(() => entities.push(['ghost', center]), 4)

  // player, SW start position
  const playerPos = Pt(2, level.height - 4)
  entities.push(['player', playerPos])

  // debug markers
  // level.set(center, 3)
  // level.set(northQuartile, 1)
  // level.set(southQuartile, 0)
  // level.set(westQuartile, 1)
  // level.set(eastQuartile, 1)

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
