import * as ROT from 'rot-js'
import { Point } from '../lib/Shape/Point'
import { Direction, DIRECTIONS } from '../lib/direction'

export type ActionTypes =
  | Move
  | MetaUI
  | Bump
  | MeleeAttack
  | Tread
  | ChangeRegion
  | ChangeZone
  | ChangeLocation
  | PickUp
  | UsePortal
  | Visualize
  | None

export type Bump = { bump: Point }
export const Bump = (pt: Point): Bump => {
  return { bump: pt }
}

export type ChangeRegion = { changeRegion: { going: 'down' | 'up' } }
export const ChangeRegion = (going: 'down' | 'up') => {
  return { changeRegion: { going } }
}

export type ChangeZone = { changeZone: { to: number } }
export const ChangeZone = (to: number) => {
  return { changeZone: { to } }
}

export type ChangeLocation = { changeLocation: { zone: string; level: 'down' | 'up' | number } }
export const ChangeLocation = (zone: string, level: 'down' | 'up' | number) => {
  return { changeLocation: { zone, level } }
}

export type MeleeAttack = { meleeAttack: Point }
export const MeleeAttack = (pt: Point): MeleeAttack => {
  return { meleeAttack: pt }
}

export type Move = { move: { dir: Direction; x: number; y: number } }
export const Move = (dir: Direction): Move => {
  switch (dir) {
    case 'NW':
      return { move: { dir, x: -1, y: -1 } }
    case 'N':
      return { move: { dir, x: 0, y: -1 } }
    case 'NE':
      return { move: { dir, x: 1, y: -1 } }
    case 'W':
      return { move: { dir, x: -1, y: 0 } }
    case 'WAIT':
      return { move: { dir, x: 0, y: 0 } }
    case 'E':
      return { move: { dir, x: 1, y: 0 } }
    case 'SW':
      return { move: { dir, x: -1, y: 1 } }
    case 'S':
      return { move: { dir, x: 0, y: 1 } }
    case 'SE':
      return { move: { dir, x: 1, y: 1 } }
    default:
      throw new Error(`Unknown Move dir: '${dir}'`)
  }
}

export type None = { none: true }
export function none(): None {
  return { none: true }
}

export type Tread = { tread: Point }
export const Tread = (pt: Point): Tread => {
  return { tread: pt }
}

export type MetaUI = { ui: string }
export const MetaUI = (doThing: string) => {
  return { ui: doThing }
}

export type PickUp = { pickUp: boolean }
export const PickUp = () => {
  return { pickUp: true }
}

export type UsePortal = { usePortal: boolean }
export const UsePortal = () => {
  return { usePortal: true }
}

export type Visualize = { visualize: string }
export const Visualize = (visualize: string) => {
  return { visualize }
}

export function __randomMove(): ActionTypes {
  const dir = ROT.RNG.getItem(Object.keys(DIRECTIONS)) as Direction
  return Move(dir)
}
