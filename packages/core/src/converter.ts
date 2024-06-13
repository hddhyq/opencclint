import * as opencc from 'opencc-js'
import type { ConverterOptions } from 'opencc-js'
import { OpencclintConfig } from './config'

const ocInstance = OpencclintConfig.getInstance()

export function converter(
  text: string,
  options?: ConverterOptions,
): string {
  const config = ocInstance.getConfig()

  const converter: opencc.ConvertText = opencc.Converter(options! || config.conversion)

  return converter(text)
}
