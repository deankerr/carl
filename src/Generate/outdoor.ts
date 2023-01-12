import * as ROT from 'rot-js'
import { Level } from '../Model/Level'
import { Grid } from '../Model/Grid'
import { NewLevel } from './generate'

export const outdoor = (width = 36, height = 36): NewLevel => {
  console.log('createOutdoor')

  const level = Grid.fill(width, height, 0)

  return [new Level('outdoor', level, new Map(), []), []]
}
