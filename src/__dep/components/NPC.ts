import { Component } from '.'

export interface NPC extends Component {
  id: 'NPC'
}

export function NPC(): NPC {
  return { id: 'NPC' }
}
