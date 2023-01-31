import { Engine } from '../Core/Engine'

export function processFormUpdate(engine: Engine) {
  const { local } = engine

  // iterate through each entity with triggers, if a matching tag is found, update the entity's
  // form to the relevant set
  const setTriggers = local.get('formSet', 'formSetTriggers', 'signalModified')
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

        local
          .entity(entity)
          .modify('form', ...newForm)
          .remove('signalModified')
      }
    })
  }
}
