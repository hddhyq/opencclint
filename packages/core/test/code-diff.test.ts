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

  it('should diff cn to twp conversion', () => {
    const original = 'U盘123软件开发'
    const modified = '隨身碟123軟體開發'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(2)
    expect(diffResult.positions[0]).toMatchObject({
      start: 0,
      end: 2,
      replacement: '隨身碟',
      line: 1,
      column: 1,
    })
    expect(diffResult.positions[1]).toMatchObject({
      start: 5,
      end: 9,
      replacement: '軟體開發',
      line: 1,
      column: 6,
    })
  })

  it('should handle mixed content with numbers', () => {
    const original = '文件夹abc123计算机'
    const modified = '資料夾abc123電腦'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(2)
    expect(diffResult.positions[0].replacement).toBe('資料夾')
    expect(diffResult.positions[1].replacement).toBe('電腦')
  })

  it('should handle single character changes', () => {
    const original = '台'
    const modified = '臺'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(1)
    expect(diffResult.positions[0]).toMatchObject({
      start: 0,
      end: 1,
      replacement: '臺',
      line: 1,
      column: 1,
    })
  })

  it('should handle multi-line text', () => {
    const original = `第一行软件
第二行硬件`
    const modified = `第一行軟體
第二行硬體`

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(2)
    expect(diffResult.positions[0]).toMatchObject({
      start: 3,
      end: 5,
      replacement: '軟體',
      line: 1,
      column: 4,
    })
    expect(diffResult.positions[1]).toMatchObject({
      start: 10,
      end: 11,
      replacement: '體',
      line: 2,
      column: 5,
    })
  })

  it('should handle no changes', () => {
    const original = 'abc123!@#'
    const modified = 'abc123!@#'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(0)
  })

  it('should handle empty strings', () => {
    const original = ''
    const modified = ''

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(0)
  })

  it('should handle insertion at beginning', () => {
    const original = '测试'
    const modified = '新测试'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(1)
    expect(diffResult.positions[0]).toMatchObject({
      start: 0,
      end: 0,
      replacement: '新',
      line: 1,
      column: 1,
    })
  })

  it('should handle deletion', () => {
    const original = '删除测试'
    const modified = '测试'

    const diffResult = codeDiff(original, modified)

    expect(diffResult.positions).toHaveLength(1)
    expect(diffResult.positions[0]).toMatchObject({
      start: 0,
      end: 2,
      replacement: '',
      line: 1,
      column: 1,
    })
  })
})
