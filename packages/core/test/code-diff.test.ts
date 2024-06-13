import { describe, expect, it } from 'vitest'
import { codeDiff } from '../src'

describe('code-diff', () => {
  it('should diff code', () => {
    const original = `
      // some code
      // opencclint-disable


      // opencclint-enable

      // opencclint-disable-next-line

      O灣測試物件 O灣
    `
    const modified = `
      // some code
      // opencclint-disable


      // opencclint-enable

      // opencclint-disable-next-line

      0湾测试物件 O湾
    `

    const diffResult = codeDiff(original, modified)
    const diffsText = diffResult.positions.map((d) => {
      return diffResult.original.substring(d.start, d.end)
    })

    expect(diffsText).toEqual(['O灣測試', '灣'])
  })
})
