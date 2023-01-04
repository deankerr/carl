import { Components } from './Components'
import * as Component from './Components'

export type EntityID = { readonly id: string }
export type Entity = EntityID & Components

export const templates = {
  door: () => {
    return {
      id: 'door',
      ...Component.render('+', 'saddlebrown'),
      ...Component.renderSeenColor('#4d2509'),
      ...Component.door(),
      ...Component.trodOn('You carefully navigate through the door.'),
    }
  },
}
