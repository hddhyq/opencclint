import process from 'node:process'
import { resolve } from 'node:path'
import { OpencclintConfig, conversionOptions } from '../../core/src'

export type ConversionOptions = typeof conversionOptions[number]

export interface Options {
  config?: string
  exclude?: string
  ignore?: string
  translate?: `${ConversionOptions}=>${ConversionOptions}`
  fix?: boolean
}

export const ocInstance = OpencclintConfig.getInstance()

export async function initConfig(options: Options) {
  await ocInstance.loadConfig({ cwd: process.cwd() })

  if (options.config) {
    const configPath = resolve(process.cwd(), options.config)
    await ocInstance.mergeConfigFile(configPath)
  }

  if (options.exclude) {
    const exclude = options.exclude.split(',')
    ocInstance.mergeConfig({ ignoreWords: exclude })
  }

  if (options.ignore) {
    const ignore = options.ignore.split(',')
    ocInstance.mergeConfig({ exclude: ignore })
  }

  if (options.translate) {
    const [from, to] = options.translate.split('2') as ConversionOptions[]
    if (!from || !to)
      throw new Error('Invalid translation format. Please use the following format: from2to')

    if (!conversionOptions.includes(from) || !conversionOptions.includes(to))
      throw new Error(`Invalid conversion options. Please use one of the following: ${conversionOptions.join(', ')}`)

    ocInstance.mergeConfig({ conversion: { from, to } })
  }

  if (options.fix)
    ocInstance.mergeConfig({ fix: true })

  return ocInstance
}
