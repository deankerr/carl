// TODO add charMap type safety
type BaseGraphic = { char: string; color: string }

export type Render = {
  render: {
    base: BaseGraphic
    seen?: Partial<BaseGraphic>
    baseDoorOpen?: Partial<BaseGraphic>
  }
}

export const render = (as: Render['render']) => {
  return {
    render: {
      ...as,
    },
  }
}

// const tnpc = newRender5({
//   base: { char: 'K', color: 'yellow' },
// })

// const twall = newRender5({
//   base: { char: '#', color: 'grey' },
//   seen: { color: 'darkgrey' },
// })

// const tdoor = newRender5({
//   base: { char: '+', color: 'brown' },
//   seen: { color: 'darkbrown' },
//   baseDoorOpen: { char: '/' },
// })
