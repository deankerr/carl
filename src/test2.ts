type Entity = { eID: number } & Image & Name

type Image = { char: string; color: string }
type Name = { name: string }

function image(char: string, color: string): Image {
  return { char, color }
}

function name(name: string): Name {
  return { name }
}

const components = { image, name }

type EDef = { [Key in keyof typeof components]: ReturnType<typeof components[Key]> }

const path: EDef = {
  name: {
    name: 'path',
  },
  image: {
    char: 'path',
    color: 'red',
  },
}

class Factory {
  count = 0

  create(t: EDef): Entity {
    //   const e = Object.entries(t).reduce((acc, curr) => {
    //     return {...acc, [curr[0]]: components[curr[0]]()}
    //   })
    // }
  }
}

type ERecord = Partial<{ [Key in keyof typeof components]: Parameters<typeof components[Key]> }>

const list: ERecord[] = [{ name: ['path'], image: ['path', 'red'] }, { name: ['wall'] }]

export {}
