const suppress = [
  'entity.attach.lightFlicker',
  'entity.attach.form',
  'entity.attach.formSetAutoCycle',
  'entity.attach.emitLight',
]

const promote = ['sys.handleRegionChange']

class Logger {
  logGroups = new Map<string, LogGroup>()
  items: LogItem[] = []

  constructor() {
    console.log(this)
  }

  createGroup(pID: string) {
    const group = { pID, times: [], avg: 0, items: [] }
    this.logGroups.set(pID, group)
    return group
  }

  getGroup(pID: string) {
    return this.logGroups.get(pID) ?? this.createGroup(pID)
  }

  createLogger(top: string, ...pIDs: string[]) {
    const pID = top + '.' + pIDs.join('.')
    const group = this.getGroup(pID)

    const t = Date.now()

    const msg = (...text: string[]) => {
      if (suppress.includes(pID)) {
        group.items.push(suppressedItem)
        return
      }

      const item: LogItem = { pID, text: text.join(' '), level: logLevel.info }
      group.items.push(item)
      this.items.push(item)

      if (promote.includes(pID)) console.log(item.pID, item.text)
    }

    const end = (...text: string[]) => {
      if (text.length > 0) msg(...text)
      const tEnd = Date.now() - t
      if (group.times.length > 1000) group.times = group.times.slice(-200)
      group.times.push(tEnd)
      group.avg = group.times.reduce((a, b) => a + b) / group.times.length
    }

    const timer = { msg, end }

    return timer
  }

  cull() {
    if (this.items.length < 100000) return
    this.logGroups = new Map<string, LogGroup>()
    this.items = []
    console.log('Logs culled!')
  }

  info() {
    const info = []
    for (const [key, group] of this.logGroups) {
      info.push({ key, avg: group.avg.toFixed(2), items: group.items.length })
    }
    console.table(info)
    console.log(this)
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

type LogGroup = {
  pID: string
  times: number[]
  avg: number
  items: LogItem[]
}

type LogItem = { pID: string; level: LogLevel; text: string }

const logLevel = { info: 'info', suppressed: 'suppressed' } as const
type LogLevel = keyof typeof logLevel

const suppressedItem = { pID: '', text: '', level: logLevel.suppressed }
