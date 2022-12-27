import { ConsoleRender } from './components'

export type Terrain = {
  id: string
  renderVisible: ConsoleRender
  renderSeen: ConsoleRender
  walkable: boolean
  transparent: boolean
}

type TerrainDict = { [key: number]: Terrain }

export const TerrainDict: TerrainDict = {
  0: {
    id: 'path',
    renderVisible: ConsoleRender('.', '#666'),
    renderSeen: ConsoleRender('.', '#444'),
    walkable: true,
    transparent: true,
  },
  1: {
    id: 'wall',
    renderVisible: ConsoleRender('#', '#666'),
    renderSeen: ConsoleRender('#', '#444'),
    walkable: false,
    transparent: false,
  },
}
