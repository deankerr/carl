import { render, Render } from '../Component/Render'
export type Terrain = {
  title: string
  walkable: boolean
  transparent: boolean
} & Render

export const TerrainDictionary: { [key: number]: Terrain } = {
  0: {
    title: 'path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  1: {
    title: 'wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O#', color: '#666' },
      seen: { color: '#555' },
    }),
  },
}
