import { Component } from '.'

export interface ConsoleRender extends Component {
  char: string
  fg: string
  bg: string
}

export function ConsoleRender(char: string, fg: string, bg = ''): ConsoleRender {
  return {
    id: 'ConsoleRender',
    char,
    fg,
    bg,
  }
}
