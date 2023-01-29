// export type TagActor = { tagActor: true }
// export type TagBlocksLight = { tagBlocksLight: true }
// export type TagCurrentTurn = { tagCurrentTurn: true }
// export type TagDead = { tagDead: true }
// export type TagDoor = { tagDoor: true }
// export type TagDoorOpen = { tagDoorOpen: true }
// export type TagMeleeAttackTarget = { tagMeleeAttackTarget: true }
// export type TagMemorable = { tagMemorable: true }
// export type TagPlayer = { tagPlayer: true }
// export type TagLightPathUpdated = { tagLightPathUpdated: true }

type Tags = Partial<{
  playerControlled: true
  blocksLight: true
  blocksMovement: true
}>

type TagKey = keyof Tags

export type Tag = { tag: { cID: 'tag' } & Tags }

export function tag(tags: TagKey[]): Tag {
  const t = tags.reduce((acc, curr) => {
    return { ...acc, [curr]: true }
  }, {})
  return { tag: { cID: 'tag', ...t } }
}

// const aa = Tag(['blocksLight', 'blocksMovement'])
