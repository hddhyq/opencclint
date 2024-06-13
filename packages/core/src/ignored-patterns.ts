import ignore from 'ignore'
import { OpencclintConfig } from './config'

// 获取 OpencclintConfig 的单例实例
const ocInstance = OpencclintConfig.getInstance()

// 定义 Ignore 类型
type Ignore = ReturnType<typeof ignore>

/**
 * Determines if the given file path is to be ignored based on the configuration.
 * @param filePath - The path of the file to check.
 * @returns True if the file should be ignored, false otherwise.
 */
export function getIsIgnored(filePath: string): boolean {
  // 获取忽略模式，若未定义则默认为空数组
  const exclude = ocInstance.getConfig()?.exclude || []
  // 创建 ignore 实例并添加忽略模式
  const ig: Ignore = ignore().add(exclude)
  // 返回文件是否被忽略
  return ig.ignores(filePath)
}
