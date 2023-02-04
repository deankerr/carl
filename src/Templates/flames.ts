import { EntityTemplate } from '../Core'

export type FlameKey = 'flames' | 'blueFlames' | 'greenFlames' | 'magentaFlames'

const flames: EntityTemplate = {
  label: 'flames',
  name: ['flames'],
  form: ['flames1', '#FF8000'],
  tag: ['feature', 'renderUnderBeing'],
  trodOn: ['You crackle and pop as you wade through the flames.'],
  formSet: [['flames1', '', '', 'flames2', '', '']],
  formSetAutoCycle: [120],
  emitLight: ['auto'],
  lightFlicker: [120],
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

export const flameVariants: EntityTemplate[] = [flames, blueFlames, greenFlames, magentaFlames]
export const flameKeys: FlameKey[] = ['flames', 'blueFlames', 'greenFlames', 'magentaFlames']
