import { Components } from './Components'
import * as Component from './Components'

export type EntityID = { readonly id: string }
export type Entity = EntityID & Components

export const templates = {
  door: {
    id: 'door',
    ...Component.render('+', 'brown'),
    ...Component.tagFurniture(),
  },
}
