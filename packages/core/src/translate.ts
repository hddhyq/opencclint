import fs from 'node:fs/promises'
import { converter } from './converter'
import { OpencclintConfig } from './config'
import { codeDiff } from './code-diff'
import { filterOutDisabledCode } from './filter-disabled'
import { getFiles } from './get-files'
import type { Config } from './config'

export interface TranslateResult {
  diffs: {
    file: string
    original: string
    modified: string
    positions: {
      start: number
      end: number
      line: number
      column: number
    }[]
  }[]
  errorCount: number
}

const ocInstance = OpencclintConfig.getInstance()

export async function translateCore(
  text: string,
  config?: Config,
) {
  const ocConfig = config || ocInstance.getConfig()

  const sanitizedText = filterOutDisabledCode(text, { ignoreWords: ocConfig.ignoreWords }) // 移除被禁用的代码

  const result = converter(sanitizedText, ocConfig?.conversion)

  return codeDiff(sanitizedText, result)
}

export async function translateFiles({
  files,
  config,
}: {
  files: string[]
  config?: Config
}) {
  if (config)
    await ocInstance.mergeConfig(config)

  const result: TranslateResult = {
    diffs: [],
    errorCount: 0,
  }

  const filterFiles = await getFiles(files)

  for (const file of filterFiles) {
    const fileContent = await fs.readFile(file, 'utf8')
    const diffs = await translateCore(fileContent)

    if (diffs.positions.length) {
      result.diffs.push({
        file,
        ...diffs,
      })
      result.errorCount += diffs.positions.length
    }
  }

  return result
}
