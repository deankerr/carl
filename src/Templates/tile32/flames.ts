import { EntityTemplate } from '../../Core'

// export type FlameKey = 'flames' | 'blueFlames' | 'greenFlames' | 'magentaFlames' | 'redFlames'

const flames = {
  label: 'flames',
  name: ['flames'],
  form: ['flames1', '#FF8000'],
  tag: ['feature'],
  trodOn: ['A sense of urgency washes over you.'],
  formSet: [['flames1', '', '', 'flames2', '', '']],
  tilesAutoCycle: [120],
  emitLight: ['auto'],
}

const blueFlames = {
  ...flames,
  label: 'blueFlames',
  form: ['flames1', '#00FFFF'],
}

const greenFlames = {
  ...flames,
  label: 'greenFlames',
  form: ['flames1', '#00FF00'],
}

const magentaFlames = {
  ...flames,
  label: 'magentaFlames',
  form: ['flames1', '#FF00FF'],
}

const redFlames = {
  ...flames,
  label: 'redFlames',
  form: ['flames1', '#FF0000'],
}

export const flameVariants = [flames, blueFlames, greenFlames, magentaFlames, redFlames]
export const flameKeys = ['flames', 'blueFlames', 'greenFlames', 'magentaFlames', 'redFlames']
