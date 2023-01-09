export type TagActor = { tagActor: true }
export const tagActor = (): TagActor => {
  return { tagActor: true }
}

export type TagBlocksLight = { tagBlocksLight: true }
export const tagBlocksLight = (): TagBlocksLight => {
  return { tagBlocksLight: true }
}

export type TagCurrentTurn = { tagCurrentTurn: true }
export const tagCurrentTurn = (): TagCurrentTurn => {
  return { tagCurrentTurn: true }
}

export type TagDead = { tagDead: true }
export const dead = (): TagDead => {
  return { tagDead: true }
}

export type TagMeleeAttackTarget = { tagMeleeAttackTarget: true }
export const tagMeleeAttackTarget = (): TagMeleeAttackTarget => {
  return { tagMeleeAttackTarget: true }
}

export type TagPlayer = { tagPlayer: true }
export const tagPlayer = (): TagPlayer => {
  return { tagPlayer: true }
}

export type TagWalkable = { tagWalkable: true }
export const tagWalkable = (): TagWalkable => {
  return { tagWalkable: true }
}
