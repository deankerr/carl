import { Grid } from './Core/Grid'

export class Level {
  terrainMap: Grid<number>
  constructor(newTerrain: Grid<number>) {
    this.terrainMap = newTerrain
  }
}
