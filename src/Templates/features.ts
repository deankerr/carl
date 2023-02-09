import { EntityTemplate } from '../Core/Entity'
import { flameVariants, FlameKey } from './flames'

export type FeatureKey = '[clear]' | 'web' | 'lilypad1'

export const features: EntityTemplate[] = [
  {
    label: 'web',
    name: ['web'],
    form: ['web1', '', ''],
    tag: ['feature', 'renderUnderBeing'],
  },
  {
    label: 'lilypad1',
    name: ['lilypad'],
    form: ['lilypad11', '', ''],
    formSet: [['lilypad11', '', '', 'lilypad12', '', '']],
    formSetAutoCycle: [1000],
    tag: ['feature', 'renderUnderBeing'],
    trodOn: ['You bounce off the lilypad.'],
  },
]
