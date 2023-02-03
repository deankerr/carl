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
  const { width } = mainDisplay.getOptions()
  const newWidth = width + 10 * n
  const newHeight = Math.floor(newWidth / 2.02)
  engine.mainDisplay.setOptions({ width: newWidth, height: newHeight })

  return `${newWidth} x ${newHeight}`
}

// if (ui === 'bgCycle') {
//   options.bgCycle = !options.bgCycle
//   engine.uiMessage(`cycleBg: ${options.bgCycle}`)
// }

// if (ui === 'localRecallAll') {
//   local.recallAll = !local.recallAll
//   engine.uiMessage(`recallAll: ${local.recallAll}`)
// }
