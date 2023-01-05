export interface Terrain {
  title: string
  walkable: boolean
  transparent: boolean
  render: {
    textChar: string
    color: string
    oryxChar: string
    oryxColor: string
  }
  consoleSeen: {
    textChar: string
    color: string
    oryxChar: string
    oryxColor: string
  }
}

export const TerrainDictionary: { [key: number]: Terrain } = {
  0: {
    title: 'path',
    walkable: true,
    transparent: true,
    render: {
      textChar: '.',
      color: '#AAA',
      oryxChar: 'O^.',
      oryxColor: '#222',
    },
    consoleSeen: {
      textChar: '.',
      color: '#777',
      oryxChar: 'O^.',
      oryxColor: '#111',
    },
  },
  1: {
    title: 'wall',
    walkable: false,
    transparent: false,
    render: {
      textChar: '#',
      color: '#666',
      oryxChar: 'O^#',
      oryxColor: '#666',
    },
    consoleSeen: {
      textChar: '#',
      color: '#444',
      oryxChar: 'O^#',
      oryxColor: '#555',
    },
  },
}
