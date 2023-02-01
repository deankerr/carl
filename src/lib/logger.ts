class Logger {
  groups = new Map<string, logGroup>()
  items: LogItem[] = []

  constructor() {
    console.log(this)
  }

  createGroup(pID: string) {
    const group = { pID, times: [], avg: 0, items: [] }
    this.groups.set(pID, group)
    return group
  }

  getGroup(pID: string) {
    return this.groups.get(pID) ?? this.createGroup(pID)
  }

  createLogger(...pIDs: string[]) {
    const pID = pIDs.join('.')
    const group = this.getGroup(pID)

    const t = Date.now()

    const msg = (...text: string[]) => {
      const item: LogItem = { pID, text: text.join(' '), level: logLevel.info }
      group.items.push(item)
      this.items.push(item)
    }

    const end = (...text: string[]) => {
      if (text.length > 0) msg(...text)
      const tEnd = Date.now() - t
      if (group.times.length > 10000) group.times = group.times.slice(-100)
      group.times.push(tEnd)
      group.avg = group.times.reduce((a, b) => a + b) / group.times.length
    }

    const timer = {
      msg,
      end,
    }

    return timer
  }
}

const loggerI = new Logger()
window.logger = loggerI
export const logger = loggerI.createLogger.bind(loggerI)

declare global {
  interface Window {
    logger: Logger
  }
}

type logGroup = {
  pID: string
  times: number[]
  avg: number
  items: LogItem[]
}

type LogItem = { pID: string; level: LogLevel; text: string }

const logLevel = { info: 'info' } as const
type LogLevel = keyof typeof logLevel
