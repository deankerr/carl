// TODO add charMap type safety
export type BaseGraphic = { char: string; color: string }

export type Graphic = {
  render: {
    base: BaseGraphic
    seen?: Partial<BaseGraphic>
    baseDoorOpen?: Partial<BaseGraphic>
  }
}

export const render = (as: Graphic['render']) => {
  return {
    render: {
      ...as,
    },
  }
}
