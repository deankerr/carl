export type TagDead = { tagDead: true }
export const dead = (): TagDead => {
  return { tagDead: true }
}
