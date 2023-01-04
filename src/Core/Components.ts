import { ActionTypes } from '../Action'

export type Render = { render: { char: string; color: string } }
export type Position = { position: { x: number; y: number } }
export type TagPlayer = { tagPlayer: true }
export type FOV = { fov: { radius: number; visible: string[] } }
export type Seen = { seen: { visible: string[] } }
export type TagCurrentTurn = { tagCurrentTurn: true }
export type TagWalkable = { tagWalkable: true }
export type TagActor = { tagActor: true }
export type Acting = { acting: ActionTypes }
export type TagMeleeAttackTarget = { tagMeleeAttackTarget: true }
export type TagDead = { tagDead: true }
export type RenderSeenColor = { renderSeenColor: { color: string } }
export type Door = { door: { open: boolean } }
export type TrodOn = { trodOn: { message: string } }

export type Components = Partial<
  Position &
    Render &
    TagPlayer &
    FOV &
    Seen &
    TagCurrentTurn &
    TagWalkable &
    TagActor &
    Acting &
    TagMeleeAttackTarget &
    TagDead &
    RenderSeenColor &
    Door &
    TrodOn
>

export const render = (char: string, color: string): Render => {
  return { render: { char, color } }
}

export const position = (x: number, y: number): Position => {
  return { position: { x, y } }
}

export const tagPlayer = (): TagPlayer => {
  return { tagPlayer: true }
}

export const fov = (radius: number): FOV => {
  return { fov: { radius, visible: [] } }
}

export const seen = (pts?: string[]): Seen => {
  return { seen: { visible: pts ?? [] } }
}

export const tagCurrentTurn = (): TagCurrentTurn => {
  return { tagCurrentTurn: true }
}

export const tagWalkable = (): TagWalkable => {
  return { tagWalkable: true }
}

export const tagActor = (): TagActor => {
  return { tagActor: true }
}

export const acting = (action: ActionTypes): Acting => {
  return { acting: action }
}

export const tagMeleeAttackTarget = (): TagMeleeAttackTarget => {
  return { tagMeleeAttackTarget: true }
}

export const dead = (): TagDead => {
  return { tagDead: true }
}

export const renderSeenColor = (color: string): RenderSeenColor => {
  return { renderSeenColor: { color } }
}

export const door = (open = false) => {
  return { door: { open } }
}

export const trodOn = (message: string) => {
  return { trodOn: { message } }
}
