import {
  Acting,
  CycleGraphic,
  Description,
  Door,
  EmitLight,
  FOV,
  Graphic,
  Position,
  TagActor,
  TagBlocksLight,
  TagCurrentTurn,
  TagDead,
  TagMeleeAttackTarget,
  TagMemorable,
  TagPlayer,
  TagWalkable,
  TrodOn,
} from '../Component/'

export type Components = Partial<
  Position &
    Acting &
    CycleGraphic &
    Description &
    Door &
    EmitLight &
    FOV &
    Graphic &
    TagActor &
    TagBlocksLight &
    TagCurrentTurn &
    TagDead &
    TagMeleeAttackTarget &
    TagMemorable &
    TagPlayer &
    TagWalkable &
    TrodOn
>

export const componentName = <C extends Components>(component: C) => {
  return Reflect.ownKeys(component).join()
}
