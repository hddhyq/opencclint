import { stringDiff } from './utils/diff'

// 定义一个类型来表示变化的位置
interface Position {
  start: number
  end: number
  line: number
  column: number
}

// 定义 codeDiff 函数返回类型
export interface CodeDiffResult {
  original: string // 原始字符串
  modified: string // 修改后的字符串
  positions: Position[] // 变化位置的数组
}

export function codeDiff(original: string, modified: string): CodeDiffResult {
  // 计算原始字符串和修改后字符串之间的差异
  const diffs = stringDiff(original, modified, false)

  // 准备一个数组来存储差异的位置
  const positions: Position[] = []

  // 从差异结果中提取变化的位置
  for (const diff of diffs) {
    const key = diff.modifiedLength ? 'modified' : 'original'
    const positionStart = diff[`${key}Start`]
    const positionEnd = positionStart + diff[`${key}Length`]

    positions.push({
      start: positionStart,
      end: positionEnd,
      ...getPosition(original, positionStart),
    })
  }

  // 返回原始字符串、修改后的字符串以及变化位置
  return {
    original,
    modified,
    positions,
  }
}

function getPosition(text: string, position: number): { line: number, column: number } {
  let totalLength = 0
  const lines = text.split(/\r?\n/)

  // 遍历每一行，使用更简洁的 for-loop
  for (let i = 0; i < lines.length; i++) {
    // 当前行的长度
    const lineLength = lines[i].length

    // 如果加上当前行长度后仍未达到position，继续累加
    if (totalLength + lineLength + 1 > position) {
      // 计算列号，position减去当前累积长度，再加1（因为列号从1开始）
      const column = position - totalLength + 1
      // 返回行号和列号，行号从1开始
      return { line: i + 1, column }
    }

    // 更新总长度，加上当前行的长度和换行符长度
    totalLength += lineLength + 1
  }

  // 如果position超出文本长度，可以返回undefined或者最后一行的信息
  return {
    line: -1,
    column: -1,
  }
}
