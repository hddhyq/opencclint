const blockDisable = /opencclint-disable\s*[^-]*$/
const blockEnable = /opencclint-enable\s*.*$/
const nextLineDisable = /opencclint-disable-next-line\s*.*/
const inlineDisable = /opencclint-disable-line\s*.*/

const commentsReg = {
  blockDisable,
  blockEnable,
  nextLineDisable,
  inlineDisable,
}

function detectLineEndingFormat(text: string) {
  // 检查文本中是否包含 \r\n 换行符
  if (text.includes('\r\n'))
    return '\r\n' // 如果找到 \r\n，认为是 CRLF 格式
  else
    return '\n' // 否则认为是 LF 格式
}

export function filterOutDisabledCode(text: string, options: {
  ignoreWords?: string[]
} = { ignoreWords: [] }): string {
  let ignoreNextLine = false
  let inDisabledBlock = false

  const { ignoreWords } = options
  let exclusionRegex: RegExp | undefined

  // 创建正则表达式，只有当有忽略词时
  if (ignoreWords?.length)
    exclusionRegex = new RegExp(`(${ignoreWords.join('|')})`, 'gi')

  const lineEndingFormat = detectLineEndingFormat(text)

  // 使用正则表达式匹配不同的换行符
  return text.split(/\r?\n/).map((line) => {
    // 如果存在忽略词，则替换这些词为'O'字符
    const processedLine = exclusionRegex ? line.replace(exclusionRegex, match => ' '.repeat(match.length)) : line

    if (processedLine.match(commentsReg.blockDisable)) {
      inDisabledBlock = true
      return line // 开始禁用块后，移除注释行
    }
    else if (processedLine.match(commentsReg.blockEnable)) {
      inDisabledBlock = false
      return line // 结束禁用块后，移除注释行
    }
    else if (processedLine.match(commentsReg.nextLineDisable)) {
      ignoreNextLine = true
      return line // 移除禁用下一行的注释行
    }
    else if (processedLine.match(commentsReg.inlineDisable)) {
      return ' '.repeat(line?.length) // 禁用该行，移除整行
    }

    if (ignoreNextLine || inDisabledBlock) {
      ignoreNextLine = false // 重置下一行禁用标志
      return ' '.repeat(line?.length) // 移除因禁用状态的行
    }

    return processedLine // 返回处理过的行
  }).join(lineEndingFormat) // 使用\n重新组合所有行
}
