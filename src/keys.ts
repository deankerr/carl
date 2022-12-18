type Callback = (code: string) => void

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
  listen(code: string) {
    // console.log('Key:', code)
    if (this.listener) this.listener(code)
  }
}
