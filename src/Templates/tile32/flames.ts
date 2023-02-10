import { EntityTemplate } from '../../Core'

export type FlameKey = 'flames' | 'blueFlames' | 'greenFlames' | 'magentaFlames' | 'redFlames'

const flames: EntityTemplate = {
  label: 'flames',
  name: ['flames'],
  form: ['flames1', '#FF8000'],
  tag: ['feature'],
  trodOn: ['A sense of urgency washes over you.'],
  formSet: [['flames1', '', '', 'flames2', '', '']],
  formSetAutoCycle: [120],
  emitLight: ['auto'],
}

const blueFlames: EntityTemplate = {
  ...flames,
  label: 'blueFlames',
  form: ['flames1', '#00FFFF'],
}

const greenFlames: EntityTemplate = {
  ...flames,
  label: 'greenFlames',
  form: ['flames1', '#00FF00'],
}

const magentaFlames: EntityTemplate = {
  ...flames,
  label: 'magentaFlames',
  form: ['flames1', '#FF00FF'],
}

const redFlames: EntityTemplate = {
  ...flames,
  label: 'redFlames',
  form: ['flames1', '#FF0000'],
}

export const flameVariants: EntityTemplate[] = [
  flames,
  blueFlames,
  greenFlames,
  magentaFlames,
  redFlames,
]
export const flameKeys: FlameKey[] = [
  'flames',
  'blueFlames',
  'greenFlames',
  'magentaFlames',
  'redFlames',
]
