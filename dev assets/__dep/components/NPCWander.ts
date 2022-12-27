import { Component } from '.'

export interface NPCWander extends Component {
  id: 'NPCWander'
}

export function NPCWander(): NPCWander {
  return { id: 'NPCWander' }
}
