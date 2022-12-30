export interface Terrain {
  name: string
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
    name: 'path',
    walkable: true,
    transparent: true,
    console: {
      char: '.',
      color: '#666',
    },
    consoleSeen: {
      char: '.',
      color: '#444',
    },
  },
  1: {
    name: 'wall',
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
