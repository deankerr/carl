import * as Generate from '../Generate'
import { logger } from '../lib/logger'
import { Region } from './'

export class Atlas {
  domains: Domain[] = [
    { label: 'desert', generator: Generate.desert, regions: [], regionIndex: 0 },
    { label: 'graveyard', generator: Generate.overworld, regions: [], regionIndex: 0 },
    { label: 'dungeon', generator: Generate.dungeon, regions: [], regionIndex: 0 },
  ]

  domain = this.domains[0]
  domainIndex = 0

  region = this.domain.regions[0]

  local() {
    return this.region
  }

  descend() {
    logger('atlas').msg('atlas descend')
    const index = ++this.domain.regionIndex
    this.region = this.domain.regions[index]

    if (!this.region) this.generate(index)
  }

  ascend() {
    if (this.domain.regionIndex < 1) return console.log(`You can't go there.`)
    logger('atlas').msg('atlas ascend')

    const index = --this.domain.regionIndex
    this.region = this.domain.regions[index]

    if (!this.region) this.generate(index)
  }

  generate(index: number) {
    logger('atlas').msg('atlas: generate', this.domain.label)
    const region = this.domain.generator()
    this.domain.regions[index] = region
    this.region = region
  }

  setDomain(index: number) {
    logger('atlas').msg('atlas setDomain')
    this.domainIndex = index
    this.domain = this.domains[index]

    const i = this.domain.regionIndex
    this.region = this.domains[index].regions[i]

    if (!this.region) this.generate(i)
  }
}

export type Domain = {
  label: string
  generator: (width?: number, height?: number) => Region
  regions: Region[]
  regionIndex: number
}
