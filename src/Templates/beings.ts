// import { CONFIG } from '../config'
import { EntityTemplate } from '../Core/Entity'

export type BeingKey = 'player'

export const beings: EntityTemplate[] = [
  {
    label: 'player',
    name: ['player'],
    form: ['@', '#EE82EE'],
    tag: ['playerControlled', 'actor', 'blocksMovement', 'being', 'signalUpdatePlayerFOV'],
    fieldOfView: [16],
  },
]
