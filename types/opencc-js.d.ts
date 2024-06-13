export type Locale = 'cn' | 'tw' | 'twp' | 'hk' | 'jp' | 't'

export interface ConverterOptions {
  from?: Locale
  to?: Locale
}

export type ConvertText = (text: string) => string

export function Converter(options: ConverterOptions): ConvertText
