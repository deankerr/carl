export type Seen = { seen: { visible: string[] } } // cellSeen? cellMemory?

export const seen = (pts?: string[]): Seen => {
  return { seen: { visible: pts ?? [] } }
}
