import { Grid } from '../Model/Grid'
import { Terrain } from '../Templates'
import { createTemplates } from '../Core/Entity'
import { Level } from '../Model/Level'

// stairs/connectors?
export function overworld(width = 60, height = 29) {
  const terrain = Grid.fill(width, height, Terrain.deadGrass)

  const entities = createTemplates()

  const level = new Level('overworld', terrain)
}
