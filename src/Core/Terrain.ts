import { render, Render } from '../Component/Render'
export interface Terrain {
  title: string
  walkable: boolean
  transparent: boolean
  render: Render
}

export const TerrainDictionary: { [key: number]: Terrain } = {
  0: {
    title: 'path',
    walkable: true,
    transparent: true,
    render: render({
      base: { char: 'O.', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  1: {
    title: 'wall',
    walkable: false,
    transparent: false,
    render: render({
      base: { char: 'O#', color: '#666' },
      seen: { color: '#555' },
    }),
  },
}
