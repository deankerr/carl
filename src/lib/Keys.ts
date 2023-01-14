// Simple keyboard listener

type Callback = (code: string) => unknown

export class Keys {
  listener: Callback | null = null

  constructor() {
    document.addEventListener('keydown', (event) => {
      this.listen(event.code)
    })
  }

  add(callback: Callback) {
    this.listener = callback
  }

  // events call this method with keyCode, pass through to subscribed listener
  private listen(code: string) {
    if (this.listener) this.listener(code)
  }

  cleanup() {
    this.listener = null
  }
}
