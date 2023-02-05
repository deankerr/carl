import { Engine } from '../Core/Engine'
// import { logger } from '../lib/logger'

export function processFormUpdate(engine: Engine) {
  // const log = logger()
  const { local, options } = engine
  if (!options.formUpdate) return

  // iterate through each entity with triggers, if a matching tag is found, update the entity's
  // form to the relevant set
  const setTriggers = local.get('formSet', 'formSetTriggers')
  for (const entity of setTriggers) {
    const { form, formSet, formSetTriggers } = entity
    formSetTriggers.forEach((tag, tagIndex) => {
      if (tag in entity) {
        const i = tagIndex * 3

        const newForm = [
          formSet[i] === '' ? form.char : formSet[i],
          formSet[i + 1] === '' ? form.color : formSet[i + 1],
          formSet[i + 2] === '' ? form.bgColor : formSet[i + 2],
        ] as [string, string, string]

        local.entity(entity).modify('form', ...newForm)
      }
    })
  }

  // find any cycle entity whose last update time has exceeded frequency, and update their form
  const autoCyclers = local.get('formSet', 'formSetAutoCycle')
  for (const entity of autoCyclers) {
    const { form, formSet, formSetAutoCycle: cycle } = entity
    if (Date.now() - cycle.lastUpdate > cycle.frequency) {
      const nextI = cycle.current + 3
      const i = nextI >= formSet.length ? 0 : nextI

      const newForm = [
        formSet[i] === '' ? form.char : formSet[i],
        formSet[i + 1] === '' ? form.color : formSet[i + 1],
        formSet[i + 2] === '' ? form.bgColor : formSet[i + 2],
      ] as [string, string, string]

      local
        .entity(entity)
        .modify('form', ...newForm)
        .modify('formSetAutoCycle', cycle.frequency, i, Date.now())
    }
  }
}
