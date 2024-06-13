import { describe, expect, it } from 'vitest'
import { converter } from '../src'

describe('converter', () => {
  it('should convert cn to tw', () => {
    const text = '台湾'

    expect(converter(text)).toEqual('臺灣')
  })

  it('should convert tw to cn', () => {
    const text = '臺灣'

    expect(converter(text, { from: 'tw', to: 'cn' })).toEqual('台湾')
  })
})
