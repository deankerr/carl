/* eslint-disable @typescript-eslint/no-non-null-assertion */
class Logger {
  groups = new Map<string, logGroup>()
  items: LogItem[] = []

  constructor() {
    console.log('Logger init')
  }

  createLogGroup(pID: string) {
    this.groups.set(pID, { pID, times: [], avg: 0, items: [] })
  }

  createLogger(...pIDs: string[]) {
    const pID = pIDs.join(',')
    if (!this.groups.has(pID)) this.createLogGroup(pID)
    const group = this.groups.get(pID)!

    const t = Date.now()

    const msg = (...text: string[]) => {
      const item: LogItem = { pID, level: logLevel.info, text: text.join(' ') }
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
      pID,
      logKey: pID,
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
