import { render, Render } from '../Component/Render'
export type Terrain = {
  title: string
  walkable: boolean
  transparent: boolean
  tread?: string
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
  2: {
    title: 'cracked wall',
    walkable: false,
    transparent: false,
    ...render({
      base: { char: 'O[', color: '#666' },
      seen: { color: '#555' },
    }),
  },
  3: {
    title: 'water',
    walkable: true,
    transparent: true,
    tread: 'You splash through the water.',
    ...render({
      base: { char: '~', color: 'blue' },
      seen: { color: 'darkblue' },
    }),
  },
  4: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.0', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  5: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.1', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  6: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.2', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  7: {
    title: 'cracked path',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O.3', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  8: {
    title: 'grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O"', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  9: {
    title: 'dead grass',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: 'O:', color: '#222' },
      seen: { color: '#111' },
    }),
  },
  10: {
    title: 'void',
    walkable: true,
    transparent: true,
    ...render({
      base: { char: ' ', color: '#000' },
    }),
  },
}
