import { resolve } from 'node:path'
import vscode from 'vscode'
import { OpencclintConfig, conversionOptions } from '../../core/src'
import { loadCompatibleConfig } from './compatible-config'

export type ConversionOptions = typeof conversionOptions[number]

export const ocInstance = OpencclintConfig.getInstance()

export function getConfig<T>(section: string) {
  return vscode.workspace.getConfiguration('opencclint').get<T>(section)!
}

export async function initConfig() {
  try {
    const folders = vscode.workspace.workspaceFolders

    if (!folders)
      return

    const rootPath = folders[0].uri.fsPath
    await ocInstance.loadConfig({ cwd: rootPath })
    const vsConfig = vscode.workspace.getConfiguration('opencclint')

    if (vsConfig.get('ignoreWords')) {
      const exclude = vsConfig.get('ignoreWords') as string[]
      ocInstance.mergeConfig({ ignoreWords: exclude })
    }

    if (vsConfig.get('exclude')) {
      const ignore = vsConfig.get('exclude') as string[]
      ocInstance.mergeConfig({ exclude: ignore })
    }

    if (vsConfig.get('config')) {
      const config = vsConfig.get('config') as string
      const configPath = resolve(rootPath, config)
      await ocInstance.mergeConfigFile(configPath)
    }

    if (vsConfig.get('converterOptions')) {
      const converterOptions = vsConfig.get('converterOptions') as `${ConversionOptions}=>${ConversionOptions}`
      // => or 2 are both valid
      const [from, to] = converterOptions.split(/=>|2/) as ConversionOptions[]

      if (!conversionOptions.includes(from) || !conversionOptions.includes(to))
        vscode.window.showErrorMessage(`Invalid conversion options. Please use one of the following: ${conversionOptions.join(', ')}`)

      ocInstance.mergeConfig({ conversion: { from, to } })
    }

    if (vsConfig.get('autoFixOnSave'))
      ocInstance.mergeConfig({ fix: true })

    // 合并旧的配置文件
    const compatibleConfig = await loadCompatibleConfig({ cwd: rootPath })
    ocInstance.mergeConfig(compatibleConfig)

    // eslint-disable-next-line no-console
    console.log('[ ocInstance ] >', JSON.stringify(ocInstance.getConfig(), null, 2))
  }
  catch (error: any) {
    vscode.window.showErrorMessage(`OpenccLint Error loading configuration: ${error?.message}`)
  }
}

let previousConfig = vscode.workspace.getConfiguration('opencclint')

export function watchConfigChange() {
  const configKeys = ['config', 'ignoreWords', 'exclude', 'converterOptions', 'autoFixOnSave']

  const stopWatchSetting = vscode.workspace.onDidChangeConfiguration(async (e) => {
    const newConfig = vscode.workspace.getConfiguration('opencclint')
    const configChanged = configKeys.some(key => e.affectsConfiguration(`opencclint.${key}`) && JSON.stringify(previousConfig[key]) !== JSON.stringify(newConfig[key]))

    if (configChanged) {
      await initConfig()
      previousConfig = newConfig
    }
  })

  const stopWatchConfig = vscode.workspace.onDidCreateFiles(async (e) => {
    if (e.files.some(file => file.fsPath.includes('opencclint.config')))
      await initConfig()
  })

  const stopWatchConfigChange = vscode.workspace.onDidSaveTextDocument(async (e) => {
    if (e.fileName.includes('opencclint.config'))
      await initConfig()
  })

  return [stopWatchSetting, stopWatchConfig, stopWatchConfigChange]
}
