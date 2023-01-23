// import * as ROT from 'rot-js'
import { CONFIG } from '../../src/config'
import { Level } from '../../src/Model/Level'
import { Grid } from '../../src/Model/Grid'
import { NewLevel } from './generate'
import { half, rnd, repeat } from '../../src/lib/util'
import { Point, Pt } from '../../src/Model/Point'
import { outdoorRuin } from './prefab/outdoorRuin'
import { createTemplates } from '../../src/Core/Entity'
import { Beings, Features, Terrain } from '../../src/Templates'

const lwidth = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayWidth : CONFIG.levelWidth
const lheight = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayHeight : CONFIG.levelHeight

export const outdoor = (width = lwidth, height = lheight): NewLevel => {
  console.log('createOutdoor')
  const level = Grid.fill(width, height, 98)

  const entities = createTemplates()

  const center = Pt(half(width), half(height))
  const northQuartile = Pt(center.x, half(center.y))
  const southQuartile = Pt(center.x, center.y + half(center.y))
  const westQuartile = Pt(half(center.x), center.y)
  const eastQuartile = Pt(center.x + half(center.x), center.y)
  const sec = { northQuartile, southQuartile, westQuartile, eastQuartile }

  // place a lot of grass
  repeat(40, () => {
    drawCluster(level.rndPt(), 100, 8)
  })

  // place some dead grass
  repeat(20, () => {
    drawCluster(level.rndPt(), 40, 9)
  })

  // TODO rnd flip n/s weighting
  // a few northern peaks
  repeat(12, () => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, half(sec.northQuartile.y)), 30, 14)
  })

  // a few northern mounds
  repeat(8, () => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, half(northQuartile.y)), 30, 13)
  })

  // the same but southern, and a bit less
  // peaks
  repeat(8, () => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, southQuartile.y + half(height - southQuartile.y)), 20, 14)
  })

  // mounds
  repeat(1, () => {
    const rPt = level.rndPt()
    drawCluster(Pt(rPt.x, southQuartile.y + half(height - southQuartile.y)), 20, 13)
  })

  // a western lake/shrubs
  const lakePtW = Pt(rnd(0, westQuartile.x), level.rndPt().y)
  drawCluster(lakePtW, 40, 15) // shrub
  drawCluster(lakePtW, 80, 3) // water
  // some lake snakes
  repeat(2, () => entities.beings.push([Beings.snake, lakePtW]))

  // a southern lake/shrubs
  const lakePtS = Pt(level.rndPt().x, rnd(southQuartile.y, height - 1))
  drawCluster(lakePtS, 10, 15) // shrub
  drawCluster(lakePtS, 20, 3) // water
  // a toad
  entities.beings.push([Beings.toad, lakePtS])

  // sparse shrubs
  repeat(4, () => drawSparseCluster(level.rndPt(), 5, 15))

  // ruin at center
  const prefab = outdoorRuin
  const ruinWidth = prefab[0].length
  const ruinHeight = prefab.length
  const offset = Pt(2, 0)
  const ruinPt = Pt(center.x - half(ruinWidth) + offset.x, center.y - half(ruinHeight) + offset.y)
  const ruinKey: { [key: string]: number } = {
    '#': 1,
    '%': 2,
    p: 0,
    '<': 10,
    '>': 11,
    '.': 98,
    ' ': -1, // skip
  }

  prefab.forEach((row, yi) => {
    row.split('').forEach((col, xi) => {
      const here = Pt(ruinPt.x + xi, ruinPt.y + yi)
      if (col === '+') {
        entities.doors.push(here)
        level.set(here, 98)
      } else if (col === ',') {
        // remove mounds/peaks, leave grass
        const t = level.get(here)
        if (t === 13 || t === 14) level.set(here, 98)
      } else if (col === 'S') {
        // a skellybones
        entities.beings.push([Beings.skeleton, here])
        level.set(here, 98)
      } else if (col === 'F') {
        // fires
        entities.features.push([Features.flames, here])
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

  // entities.features.push([Beings.flamesBlue, Pt(eastQuartile.x + 5, center.y)])
  // entities.features.push([Beings.flamesGreen, Pt(westQuartile.x - 5, center.y)])

  // some ghosts
  repeat(4, () => entities.beings.push([Beings.ghost, center]))

  // player, SW start position
  // entities.player = Pt(2, level.height - 4) // bl corner
  entities.player = center

  // debug markers
  // level.set(center, 3)
  // level.set(northQuartile, 1)
  // level.set(southQuartile, 0)
  // level.set(westQuartile, 1)
  // level.set(eastQuartile, 1)

  // const newLevel = new Level('outdoor', level, new Map(), [])
  const newLevel = new Level('outdoor', Grid.fill(3, 3, Terrain.path), new Map(), [])

  // entities.beings.push(...populateALLNPCs(newLevel))
  return [newLevel, entities]

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

  function drawSparseCluster(startPt: Point, amount: number, terrain: number) {
    repeat(amount, () => level.set(startPt.add(Pt(rnd(2, 6), rnd(2, 6))), terrain))
  }
}