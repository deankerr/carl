import { Component } from '.'

export interface NPCChasePlayer extends Component {
  id: 'NPCChasePlayer'
}

export function NPCChasePlayer(): NPCChasePlayer {
  return { id: 'NPCChasePlayer' }
}
