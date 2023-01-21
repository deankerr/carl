import { CONFIG } from '../config'
import { Grid } from '../Model/Grid'
import { Level } from '../Model/Level'
import { createTemplates } from '../Core/Entity'
import { Features } from '../Templates'
import { NewLevel } from './generate'
import { floor, half } from '../lib/util'
import { Pt } from '../Model/Point'

const lwidth = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayWidth : CONFIG.levelWidth
const lheight = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayHeight : CONFIG.levelHeight

export function testLevel(): NewLevel {
  const terrain = Grid.fill(lwidth, lheight, 0)
  const center = Pt(half(terrain.width), half(terrain.height))
  const quarterWidth = floor(terrain.width / 4)
  const centerLeft = Pt(quarterWidth, center.y)
  const centerRight = Pt(terrain.width - quarterWidth, center.y)

  const level = new Level('testLevel', terrain)

  const entities = createTemplates()
  entities.player = center

  entities.features.push([Features.flames, center])
  entities.features.push([Features.flames, centerLeft])
  entities.features.push([Features.flames, centerRight])

  return [level, entities]
}
