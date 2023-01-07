// TODO add charMap type safety
export type BaseGraphic = { char: string; color: string }

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
