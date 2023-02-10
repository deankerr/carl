import { EntityTemplate } from '../Core'

const seriesTemplate = {
  solid: {
    label: 'Solid',
    name: ['wall'],
    tile: ['Solid', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  face: {
    label: 'Wall',
    name: ['wall'],
    tile: ['Wall', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight', 'face'],
  },
  floor: {
    label: 'Floor',
    name: ['floor'],
    tile: ['Floor', '', ''],
    tag: ['terrain'],
  },
}

export function series(type: keyof typeof seriesTemplate, name: string, n: number) {
  let i = 0
  const result: EntityTemplate[] = []
  while (i <= n) {
    const base = { ...seriesTemplate[type] } as EntityTemplate
    const key = i ? `${name}${base.label}${i}` : `${name}${base.label}`
    base.label = key
    base.tile = i ? [key, '', ''] : [key + '1', '', '']
    result.push(base)
    i++
  }
  return result
}
