import { CONFIG } from '../config'
import { Grid } from '../Model/Grid'
import { Level } from '../Model/Level'
import { createTemplates } from '../Core/Entity'
import { Features } from '../Templates'
import { NewLevel } from '../../dev-assets/graveyard/generate'
import { floor, half } from '../lib/util'
import { Pt } from '../Model/Point'

const lwidth = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayWidth : CONFIG.levelWidth
const lheight = CONFIG.genLevelsAtDisplaySize ? CONFIG.mainDisplayHeight : CONFIG.levelHeight

export function testLevel(): NewLevel {
  const terrain = Grid.fill(lwidth, lheight, 0)
  const center = Pt(half(terrain.width), half(terrain.height))
  const quarterWidth = floor(terrain.width / 4)
  const quarterHeight = floor(terrain.height / 4)
  const centerLeft = Pt(quarterWidth, center.y)
  const centerRight = Pt(terrain.width - quarterWidth, center.y)

  const level = new Level('testLevel', terrain)

  const entities = createTemplates()
  entities.player = center

  entities.features.push([Features.blueFlames, centerLeft.add(Pt(0, -quarterHeight))])
  entities.features.push([Features.flames, center.add(Pt(0, -quarterHeight))])
  entities.features.push([Features.greenFlames, centerRight.add(Pt(0, -quarterHeight))])

  entities.features.push([Features.redFlames, centerLeft.add(Pt(0, quarterHeight))])
  entities.features.push([Features.yellowFlames, center.add(Pt(0, quarterHeight))])
  entities.features.push([Features.magentaFlames, centerRight.add(Pt(0, quarterHeight))])

  entities.features.push([Features.cyanFlames, Pt(half(quarterWidth), center.y)])
  entities.features.push([Features.purpleFlames, Pt(terrain.width - half(quarterWidth), center.y)])

  return [level, entities]
}
