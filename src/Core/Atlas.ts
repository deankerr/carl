import * as Generate from '../Generate'
import { logger } from '../lib/logger'
import { Region } from './'

export class Atlas {
  zones: Zone[] = [
    { label: 'cave', generator: Generate.cave, regions: [], regionIndex: 0 },
    { label: 'dungeon', generator: Generate.dungeon, regions: [], regionIndex: 0 },
    { label: 'pit', generator: Generate.pit, regions: [], regionIndex: 0 },
    { label: 'crypt', generator: Generate.crypt, regions: [], regionIndex: 0 },
  ]

  zone = this.zones[0]
  zoneIndex = 0

  region = this.zone.regions[0]

  local() {
    return this.region
  }

  descend() {
    logger('atlas').msg('atlas descend')
    const index = ++this.zone.regionIndex
    this.region = this.zone.regions[index]

    if (!this.region) this.generate(index)
  }

  ascend() {
    if (this.zone.regionIndex < 1) return console.log(`You can't go there.`)
    logger('atlas').msg('atlas ascend')

    const index = --this.zone.regionIndex
    this.region = this.zone.regions[index]

    if (!this.region) this.generate(index)
  }

  generate(index: number) {
    logger('atlas').msg('atlas: generate', this.zone.label)
    const region = this.zone.generator()
    this.zone.regions[index] = region
    this.region = region
  }

  setZone(index: number) {
    logger('atlas').msg('atlas setZone')
    console.log('set zone', index)
    const next = this.zones[index] ? index : 0
    this.zoneIndex = next
    this.zone = this.zones[next]
    localStorage.setItem('initialZone', String(index))

    const i = this.zone.regionIndex
    this.region = this.zones[next].regions[i]

    if (!this.region) this.generate(i)
  }
}

export type Zone = {
  label: string
  generator: (width?: number, height?: number) => Region
  regions: Region[]
  regionIndex: number
}
