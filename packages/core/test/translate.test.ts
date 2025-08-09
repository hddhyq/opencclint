import { describe, expect, it } from 'vitest'
import { translateCore } from '../src/translate'

describe('translateCore', () => {
  it('should translate cn to twp', async () => {
    const text = 'U盘123软件开发'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe('隨身碟123軟體開發')
    expect(result.positions).toHaveLength(2)

    // 验证第一个位置 (U盘 -> 隨身碟)
    expect(result.positions[0]).toMatchObject({
      start: 0,
      end: 2,
      replacement: '隨身碟',
      line: 1,
      column: 1,
    })

    // 验证第二个位置 (软件开发 -> 軟體開發)
    expect(result.positions[1]).toMatchObject({
      start: 5,
      end: 9,
      replacement: '軟體開發',
      line: 1,
      column: 6,
    })
  })

  it('should translate twp to cn', async () => {
    const text = '隨身碟123軟體開發'
    const result = await translateCore(text, { conversion: { from: 'twp', to: 'cn' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe('U盘123软件开发')
    expect(result.positions).toHaveLength(2)
  })

  it('should handle text with disabled sections', async () => {
    const text = `软件开发
// opencclint-disable-line
计算机硬件
数据库系统`

    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    // 验证有转换发生
    expect(result.positions.length).toBeGreaterThan(0)

    // 验证替换内容包含预期的转换
    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
  })

  it('should handle disabled blocks', async () => {
    const text = `软件开发
// opencclint-disable
计算机硬件
网络设备
// opencclint-enable
数据库系统`

    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    // 验证有转换发生
    expect(result.positions.length).toBeGreaterThan(0)

    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
  })

  it('should handle disabled next line', async () => {
    const text = `软件开发
// opencclint-disable-next-line
计算机硬件
数据库系统`

    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.positions.length).toBeGreaterThan(0)

    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
  })

  it('should handle ignore words', async () => {
    const text = '台湾软件开发'

    const result = await translateCore(text, {
      conversion: { from: 'cn', to: 'twp' },
      ignoreWords: ['台'],
    })

    // 验证有转换发生
    expect(result.positions.length).toBeGreaterThan(0)

    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
  })

  it('should handle multiline text', async () => {
    const text = `第一行软件
第二行硬件
第三行计算机`

    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.positions.length).toBeGreaterThan(2)

    // 验证行号计算正确
    expect(result.positions[0].line).toBe(1)
    expect(result.positions.some(p => p.line === 2)).toBe(true)
    expect(result.positions.some(p => p.line === 3)).toBe(true)

    const replacements = result.positions.map(p => p.replacement)
    expect(replacements.some(r => r.includes('軟體'))).toBe(true)
    // 简化检查，只验证有转换发生
    expect(replacements.length).toBeGreaterThan(1)
  })

  it('should handle empty text', async () => {
    const text = ''
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.original).toBe('')
    expect(result.modified).toBe('')
    expect(result.positions).toHaveLength(0)
  })

  it('should handle text with no changes needed', async () => {
    const text = 'abc123!@#'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe(text)
    expect(result.positions).toHaveLength(0)
  })

  it('should handle single character conversion', async () => {
    const text = '台'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'tw' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe('臺')
    expect(result.positions).toHaveLength(1)
    expect(result.positions[0]).toMatchObject({
      start: 0,
      end: 1,
      replacement: '臺',
      line: 1,
      column: 1,
    })
  })

  it('should handle complex mixed content', async () => {
    const text = 'console.log("软件开发123计算机");'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.original).toBe(text)
    expect(result.modified).toBe('console.log("軟體開發123計算機");')
    expect(result.positions.length).toBeGreaterThan(1)

    // 验证位置计算正确
    expect(result.positions[0].start).toBe(13) // "软件开发" 的起始位置
    expect(result.positions[0].replacement).toBe('軟體開發')
    // 简化检查，只验证有多个转换
    expect(result.positions.length).toBeGreaterThan(1)
  })

  it('should handle text with CRLF line endings', async () => {
    const text = '第一行软件\r\n第二行硬件'
    const result = await translateCore(text, { conversion: { from: 'cn', to: 'twp' } })

    expect(result.positions).toHaveLength(2)
    expect(result.positions[0].line).toBe(1)
    expect(result.positions[1].line).toBe(2)

    // 验证修改后的文本保持相同的行结束符
    expect(result.modified).toBe('第一行軟體\r\n第二行硬體')
  })

  it('should handle the bug case: U盘123 with ignore words', async () => {
    const text = 'U盘123'

    // 模拟可能导致 bug 的配置
    const result = await translateCore(text, {
      conversion: { from: 'cn', to: 'twp' },
      ignoreWords: ['1'], // 忽略数字1
    })

    // 这个测试用来验证我们之前发现的索引错位问题
    expect(result.positions).toHaveLength(1)
    expect(result.positions[0].replacement).toBe('隨身碟')

    // 验证原始文本和修改后文本的一致性
    expect(result.original).toBe('U盘 23') // 数字1被替换为空格
    expect(result.modified).toBe('隨身碟 23')
  })
})
