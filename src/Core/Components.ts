import {
  Acting,
  BaseGraphic,
  CycleGraphic,
  Description,
  DoorGraphic,
  EmitLight,
  FOV,
  Graphic,
  Position,
  TagActor,
  TagBlocksLight,
  TagCurrentTurn,
  TagDead,
  TagDoor,
  TagDoorOpen,
  TagMeleeAttackTarget,
  TagMemorable,
  TagPlayer,
  TagWalkable,
  TrodOn,
} from '../Component/'

export type Components = Partial<
  Graphic &
    Position &
    Acting &
    BaseGraphic &
    CycleGraphic &
    Description &
    DoorGraphic &
    EmitLight &
    FOV &
    TagActor &
    TagBlocksLight &
    TagCurrentTurn &
    TagDead &
    TagDoor &
    TagDoorOpen &
    TagMeleeAttackTarget &
    TagMemorable &
    TagPlayer &
    TagWalkable &
    TrodOn
>

export const componentName = <C extends Components>(component: C) => {
  return Reflect.ownKeys(component).join()
}
