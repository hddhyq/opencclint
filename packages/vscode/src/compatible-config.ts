/**
 * @desc:   compatible-config.ts for compatible load config for old config file, will be removed in the future.
 * @author: brokenbonesdd <brokenbonesdd@gmail.com>
 * @create: 2024-05-16 11:06:05
 */
import * as vscode from 'vscode'
import { loadConfig } from 'unconfig'
import type { LoadConfigOptions } from 'unconfig'

export async function loadCompatibleConfig(options?: Partial<LoadConfigOptions>) {
  const { config } = await loadConfig({
    sources: [
      {
        files: 'simplify.config',
      },
      {
        files: '.opencclintrc',
      },
    ],
    merge: false,
    ...options,
  })

  if (config?.ignoreTexts) {
    config.ignoreWords = Object.keys(config.ignoreTexts)
    delete config.ignoreTexts
  }

  if (config)
    vscode.window.showWarningMessage('OpenccLint: The configuration file(simplify.config.*、.opencclintrc.*) is deprecated. Please use the new configuration file format.')

  return config
}
