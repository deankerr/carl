export type ConsoleRender = {
  cid: 'ConsoleRender'
  char: string
  color: string
}

export function ConsoleRender(char: string, color: string): ConsoleRender {
  return Object.freeze({ cid: 'ConsoleRender', char, color })
}
