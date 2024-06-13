import { describe, expect, it } from 'vitest'
import { converter, filterOutDisabledCode } from '../src'

function repeatBlank(str: string) {
  return ' '.repeat(str.length)
}

describe('converter', () => {
  it('should filterOutDisabledCode & converter', () => {
    const ignoreWords = ['台']
    const codeText = `
      // some code
      // opencclint-disable
      123123
      456456
      // opencclint-enable
      123123 // opencclint-disable-line
      // opencclint-disable-next-line
      456456
      台湾测试物件
    `

    const result = converter(filterOutDisabledCode(codeText, { ignoreWords }))
    expect(result).toEqual(`
      // some code
      // opencclint-disable
      ${repeatBlank('123123')}
      ${repeatBlank('456456')}
      // opencclint-enable
      ${repeatBlank('123123 // opencclint-disable-line')}
      // opencclint-disable-next-line
      ${repeatBlank('456456')}
      ${repeatBlank('台')}灣測試物件
    `)
  })
})
