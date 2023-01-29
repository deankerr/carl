const Components = {
  form: (name: string, char: string, color: string, bgColor = 'transparent') => {
    return { form: { name, char, color, bgColor } }
  },
  position: (x: number, y: number) => {
    return { position: { x, y } }
  },
  tag: (...tags: Tags[]) => {
    return { tags: { tags } }
  },
  trodOn: (msg: string) => {
    return { trodOn: { msg } }
  },
}

type Tags = 'blocksMovement' | 'blocksLight' | 'playerControlled'

type EntDef = { id: string } & Partial<{ [Key in keyof typeof Components]: Parameters<typeof Components[Key]> }>

const terrain: EntDef[] = [
  { id: 'path', form: ['path', 'path', 'red'] },
  { id: 'wall', form: ['wall', 'wall', 'grey'], tag: ['blocksMovement', 'blocksLight'] },
  { id: 'water', form: ['water', 'water', 'blue'] },
  { id: 'stairsDown', form: ['stairs down', 'stairsDown', 'grey'] },
  { id: 'stairsUp', form: ['stairs up', 'stairsUp', 'grey'] },
  { id: 'crackedWall', form: ['cracked wall', 'crackedWall', 'grey'], tag: ['blocksMovement', 'blocksLight'] },
  { id: 'grass', form: ['grass', 'grass', 'green'] },
  { id: 'dead grass', form: ['dead grass', 'deadGrass', 'brown'] },
  { id: 'mound', form: ['mound', 'mound', 'brown'], tag: ['blocksLight'] },
]

// const Terrain = terrain.reduce((acc, curr))
type AllComponents = ReturnType<typeof Components[keyof typeof Components]>

type Entity = { eID: number; id: string } & Partial<AllComponents>

class Factory {
  count = 0
  ents = new Map<typeof terrain[number]['id'], typeof terrain[number]>()
  createAll(t: EntDef[]) {
    t.forEach(t => {
      let e: Entity = { eID: this.count++, id: t.id }
      if (t.form) e = { ...e, ...Components.form(...t.form) }
      if (t.tag) e = { ...e, ...Components.tag(...t.tag) }
      if (t.trodOn) e = { ...e, ...Components.trodOn(...t.trodOn) }
    })
  }
}

export {}
