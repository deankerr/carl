export interface Terrain {
  title: string
  walkable: boolean
  transparent: boolean
  console: {
    char: string
    color: string
  }
  consoleSeen: {
    char: string
    color: string
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
    },
    consoleSeen: {
      char: '.',
      color: '#777',
    },
  },
  1: {
    title: 'wall',
    walkable: false,
    transparent: false,
    console: {
      char: '#',
      color: '#666',
    },
    consoleSeen: {
      char: '#',
      color: '#444',
    },
  },
}
