export * from './ConsoleRender'
export * from './Position'
export * from './Player'
export * from './NPCWander'
export * from './NPCChasePlayer'
export * from './NPC'
export * from './BlockMovement'
export * from './FOV'

export interface Component {
  id: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentI<T extends Component> = (...args: any[]) => T
