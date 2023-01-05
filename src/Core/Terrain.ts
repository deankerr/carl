export interface Terrain {
  title: string
  walkable: boolean
  transparent: boolean
  console: {
    char: string

    color: string
    oryxChar: string
    oryxColor: string
  }
  consoleSeen: {
    char: string

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
    console: {
      char: '.',
      color: '#AAA',
      oryxChar: '{O}.',
      oryxColor: '#222',
    },
    consoleSeen: {
      char: '.',
      color: '#777',
      oryxChar: '{O}.',
      oryxColor: '#111',
    },
  },
  1: {
    title: 'wall',
    walkable: false,
    transparent: false,
    console: {
      char: '#',
      color: '#666',
      oryxChar: '{O}#',
      oryxColor: '#666',
    },
    consoleSeen: {
      char: '#',
      color: '#444',
      oryxChar: '{O}#',
      oryxColor: '#555',
    },
  },
}
