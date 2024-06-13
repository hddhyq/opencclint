import fs from 'node:fs/promises'
import MagicString from 'magic-string'
import type { TranslateResult } from './translate'

/**
 * Applies translation fixes to the files based on the provided diffs.
 * @param {TranslateResult} result - Result object containing diffs and error count.
 */
export async function applyTranslationFixes(result: TranslateResult) {
  for (const diff of result.diffs) {
    try {
      // 读取原始文件内容
      const originalContent = await fs.readFile(diff.file, 'utf8')
      const s = new MagicString(originalContent)

      // 逆序处理每个位置，以避免影响后续替换的索引
      const sortedPositions = diff.positions.sort((a, b) => b.start - a.start)
      for (const position of sortedPositions)
        s.update(position.start, position.end, diff.modified.substring(position.start, position.end))

      // 将修改后的内容写回文件
      await fs.writeFile(diff.file, s.toString(), 'utf8')
    }
    catch (error) {
      console.error(`Error processing file ${diff.file}: ${error}`)
    }
  }
}
