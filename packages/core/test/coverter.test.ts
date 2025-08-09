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

  it('should convert cn to twp (Traditional Chinese with Phrases)', () => {
    const text = '软件开发'
    expect(converter(text, { from: 'cn', to: 'twp' })).toEqual('軟體開發')
  })

  it('should convert cn to twp with complex text', () => {
    const text = '计算机硬件和软件'
    expect(converter(text, { from: 'cn', to: 'twp' })).toEqual('計算機硬體和軟體')
  })

  it('should convert cn to twp with mixed content', () => {
    const text = 'U盘123'
    expect(converter(text, { from: 'cn', to: 'twp' })).toEqual('隨身碟123')
  })

  it('should convert cn to twp preserving numbers and symbols', () => {
    const text = '文件夹abc123!@#'
    expect(converter(text, { from: 'cn', to: 'twp' })).toEqual('資料夾abc123!@#')
  })

  it('should convert twp to cn', () => {
    const text = '軟體開發'
    expect(converter(text, { from: 'twp', to: 'cn' })).toEqual('软件开发')
  })

  it('should handle empty string', () => {
    expect(converter('', { from: 'cn', to: 'twp' })).toEqual('')
  })

  it('should handle string with only numbers and symbols', () => {
    const text = '123!@#abc'
    expect(converter(text, { from: 'cn', to: 'twp' })).toEqual('123!@#abc')
  })

  it('should convert cn to hk', () => {
    const text = '台湾'
    expect(converter(text, { from: 'cn', to: 'hk' })).toEqual('台灣')
  })

  it('should convert cn to jp', () => {
    const text = '台湾'
    expect(converter(text, { from: 'cn', to: 'jp' })).toEqual('台湾')
  })
})
