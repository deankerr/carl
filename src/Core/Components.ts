import {
  Graphic,
  Acting,
  TagBlocksLight,
  Door,
  TrodOn,
  Description,
  TagDead,
  Position,
  TagCurrentTurn,
  TagWalkable,
  TagMeleeAttackTarget,
  TagActor,
  FOV,
  TagPlayer,
} from '../Component/'

export type Components = Partial<
  Position &
    Graphic &
    TagPlayer &
    FOV &
    TagCurrentTurn &
    TagWalkable &
    TagActor &
    Acting &
    TagMeleeAttackTarget &
    TagDead &
    Door &
    TrodOn &
    Description &
    TagBlocksLight
>

export const componentName = <C extends Components>(component: C) => {
  return Reflect.ownKeys(component).join()
}
