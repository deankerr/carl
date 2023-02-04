import { CONFIG } from '../config'
import { Engine } from './Engine'

export function UI(engine: Engine, ui: string) {
  const { local, options } = engine
  let msg
  switch (ui) {
    case 'logWorld':
      console.log(engine)
      console.log('Local entities', local.entities)
      console.log('Local', local)
      window.logger.info()
      msg = `The world...`
      break
    case 'revealAll':
      local.revealAll = !local.revealAll
      localStorage.setItem('revealAll', `${local.revealAll}`)
      msg = `revealAll: ${local.revealAll}`
      break
    case 'animation':
      options.formUpdate = !options.formUpdate
      options.lightingUpdate = !options.lightingUpdate
      msg = `animation: ${options.formUpdate}`
      break
    case 'increaseMainDisplay':
      msg = main(engine, 1)
      break
    case 'decreaseMainDisplay':
      msg = main(engine, -1)
      break
    case 'resetMainDisplay':
      msg = main(engine, 0)
      break
    case 'debugMode':
      options.debugMode = !options.debugMode
      msg = options.debugMode ? 'Welcome to Debug' : 'Bugs crushed'
      break
  }

  msg ? engine.uiMessage(msg) : engine.uiMessage(`UI:${ui} unhandled`)
  local.hasChanged = true
}

function main(engine: Engine, n: number) {
  const { mainDisplay } = engine
  const size = { width: CONFIG.mainDisplayWidth, height: CONFIG.mainDisplayHeight }

  if (n < 0 || n > 0) {
    size.width = mainDisplay.getOptions().width + 10 * n
    size.height = Math.floor(size.width / 2.02)
  }

  engine.mainDisplay.setOptions({ width: size.width, height: size.height })
  return `${size.width} x ${size.height}`
}

// if (ui === 'bgCycle') {
//   options.bgCycle = !options.bgCycle
//   engine.uiMessage(`cycleBg: ${options.bgCycle}`)
// }

// if (ui === 'localRecallAll') {
//   local.recallAll = !local.recallAll
//   engine.uiMessage(`recallAll: ${local.recallAll}`)
// }
