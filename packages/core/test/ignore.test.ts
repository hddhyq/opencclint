import { describe, expect, it } from 'vitest'
import { filterOutDisabledCode } from '../src'

function repeatBlank(str: string) {
  return ' '.repeat(str.length)
}

describe('filterOutDisabledCode', () => {
  it('should remove disabled line', () => {
    const codeText = `
      // some code
      123123 // opencclint-disable-line
      123123
    `

    expect(filterOutDisabledCode(codeText)).toEqual(`
      // some code
      ${repeatBlank('123123 // opencclint-disable-line')}
      123123
    `)
  })

  it('should remove disabled block', () => {
    const codeText = `
      // some code
      // opencclint-disable
      123123
      123123
      // opencclint-enable
      123123
    `

    expect(filterOutDisabledCode(codeText)).toEqual(`
      // some code
      // opencclint-disable
      ${repeatBlank('123123')}
      ${repeatBlank('123123')}
      // opencclint-enable
      123123
    `)
  })

  it('should remove disabled next line', () => {
    const codeText = `
      // some code
      // opencclint-disable-next-line
      123123
      456456
    `

    expect(filterOutDisabledCode(codeText)).toEqual(`
      // some code
      // opencclint-disable-next-line
      ${repeatBlank('123123')}
      456456
    `)
  })

  it('should handle all disabled comments', () => {
    const codeText = `
      // some code
      // opencclint-disable
      123123
      456456
      // opencclint-enable
      123123 // opencclint-disable-line
      // opencclint-disable-next-line
      456456
      789789
    `

    expect(filterOutDisabledCode(codeText)).toEqual(`
      // some code
      // opencclint-disable
      ${repeatBlank('123123')}
      ${repeatBlank('456456')}
      // opencclint-enable
      ${repeatBlank('123123 // opencclint-disable-line')}
      // opencclint-disable-next-line
      ${repeatBlank('456456')}
      789789
    `)
  })

  it('should ignore words', () => {
    const codeText = '测试'

    expect(filterOutDisabledCode(codeText, { ignoreWords: ['测'] })).toEqual(' 试')
  })
})
