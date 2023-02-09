import { EntityTemplate } from '../Core'

const seriesTemplate = {
  solid: {
    label: 'Solid',
    name: ['wall'],
    form: ['Solid', '', ''],
    tag: ['terrain', 'blocksMovement', 'blocksLight'],
  },
  face: {
    label: 'Wall',
    name: ['wall'],
    form: ['Wall', '', ''],
    tag: ['terrain', 'blocksMovement', 'face'],
  },
  floor: {
    label: 'Floor',
    name: ['floor'],
    form: ['Floor', '', ''],
    tag: ['terrain', 'renderUnderBeing'],
  },
}

export function series(type: keyof typeof seriesTemplate, name: string, n: number) {
  let i = 0
  const result: EntityTemplate[] = []
  while (i <= n) {
    const base = { ...seriesTemplate[type] } as EntityTemplate
    const key = i ? `${name}${base.label}${i}` : `${name}${base.label}`
    base.label = key
    base.form = [key, '', '']
    result.push(base)
    i++
  }
  return result
}
