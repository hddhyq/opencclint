import { describe, expect, it } from 'vitest'
import { codeDiff, converter, filterOutDisabledCode, translateCore } from '../src'

function repeatBlank(str: string) {
  return ' '.repeat(str.length)
}

describe('integration tests', () => {
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

  it('should handle full cn to twp translation workflow', async () => {
    const text = 'U盘123软件开发'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe('隨身碟123軟體開發')
    expect(result.positions).toHaveLength(2)

    // 验证 positions 包含正确的 replacement 字段
    expect(result.positions[0].replacement).toBe('隨身碟')
    expect(result.positions[1].replacement).toBe('軟體開發')
  })

  it('should handle complex content with disabled sections and ignore words', async () => {
    const text = `台湾软件开发
// opencclint-disable-line
计算机硬件测试
数据库系统优化`

    const result = await translateCore(text, {
      conversion: { from: 'cn', to: 'twp' },
      ignoreWords: ['台', '测试'],
    })

    // 验证有转换发生
    expect(result.positions.length).toBeGreaterThan(0)

    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
  })

  it('should maintain consistency between codeDiff and translateCore', async () => {
    const original = 'U盘123软件'
    const modified = '隨身碟123軟體'

    // 使用 codeDiff 直接比较
    const diffResult = codeDiff(original, modified)

    // 使用 translateCore 进行转换
    const translateResult = await translateCore(original, { conversion: { from: 'cn', to: 'twp' } })

    // 两个结果应该一致
    expect(diffResult.positions).toEqual(translateResult.positions)
    expect(diffResult.modified).toBe(translateResult.modified)
  })

  it('should handle edge case with consecutive conversions', async () => {
    const text = '软件计算机硬件数据库'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    // 验证多个连续转换的索引正确性
    expect(result.positions.length).toBeGreaterThan(2)

    // 验证每个位置的索引不重叠
    for (let i = 0; i < result.positions.length - 1; i++)
      expect(result.positions[i].end).toBeLessThanOrEqual(result.positions[i + 1].start)
  })

  it('should preserve original text structure in filterOutDisabledCode', () => {
    const text = `第一行软件
// opencclint-disable-line
第二行硬件
第三行计算机`

    const filtered = filterOutDisabledCode(text)

    // 验证行数保持不变
    expect(filtered.split('\n')).toHaveLength(text.split('\n').length)

    // 验证被禁用的行被空格替换（注意：opencclint-disable-line 影响的是下一行）
    const lines = filtered.split('\n')
    // 实际上注释行本身会被替换为空格
    expect(lines[1]).toBe(repeatBlank('// opencclint-disable-line'))
  })

  it('should handle the problematic U盘123 case end-to-end', async () => {
    const text = 'U盘123'

    // 模拟完整的处理流程
    const config = {
      conversion: { from: 'cn', to: 'twp' } as const,
      ignoreWords: [] as string[],
    }

    // 1. 过滤禁用代码
    const filteredText = filterOutDisabledCode(text, { ignoreWords: config.ignoreWords })
    expect(filteredText).toBe(text) // 没有禁用标记，应该相同

    // 2. 转换
    const convertedText = converter(filteredText, config.conversion)
    expect(convertedText).toBe('隨身碟123')

    // 3. 计算差异
    const diffResult = codeDiff(filteredText, convertedText)
    expect(diffResult.positions).toHaveLength(1)
    expect(diffResult.positions[0]).toMatchObject({
      start: 0,
      end: 2,
      replacement: '隨身碟',
    })

    // 4. 验证 translateCore 的完整流程
    const translateResult = await translateCore(text, config)
    expect(translateResult.modified).toBe('隨身碟123')
    expect(translateResult.positions[0].replacement).toBe('隨身碟')
  })
})
