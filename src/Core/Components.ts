import { ActionTypes } from '../Action'
import { Point } from '../Model/Point'

export type Render = { render: { color: string; textChar: string; oryxChar?: string } }
export type Position = { position: Point }
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
export type Description = { description: { name: string } }

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
    TrodOn &
    Description
>

export const render = (color: string, textChar: string, oryxChar?: string): Render => {
  return { render: { color, textChar, oryxChar } }
}

export const position = (pt: Point): Position => {
  return { position: pt }
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

export const description = (name: string) => {
  return { description: { name } }
}
