import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import defu from 'defu'
import { resolve } from 'import-meta-resolve'
import { loadConfig as load } from 'unconfig'
import type { LoadConfigOptions } from 'unconfig'
import { OpencclintError } from './error'
import { isFileURL } from './utils'

export const conversionOptions = ['cn', 'tw', 'twp', 'hk', 'jp', 't'] as const
type ConversionOptions = typeof conversionOptions[number]

export interface Config {
  extends?: string[]
  conversion?: {
    from: ConversionOptions
    to: ConversionOptions
  }
  ignoreWords?: string[]
  exclude?: string[]
  fix?: boolean
}

const defaultOptions = {
  sources: [
    {
      files: 'opencclint.config',
    },
  ],
  merge: true,
}

const defaultConfig: Config = {
  conversion: {
    from: 'cn',
    to: 'tw',
  },
  ignoreWords: [],
  exclude: [
    'opencclint.*',
  ],
  fix: false,
}

/**
 * 递归合并扩展的配置文件。
 * @param fileList 配置文件路径列表。
 * @param mergedConfig 初始合并配置对象。
 * @returns 合并后的配置对象。
 */
async function mergeConfigs(fileList: string[], mergedConfig: Config & { cwd?: string } = {}): Promise<Config> {
  for (const file of fileList) {
    try {
      const fileURL = mergedConfig.cwd ? pathToFileURL(`${mergedConfig.cwd}/`) as unknown as string : import.meta.url
      const resolvedPath = resolve(file, fileURL)
      const resolvedPathURL = isFileURL(resolvedPath) ? resolvedPath : pathToFileURL(resolvedPath)
      const configPath = fileURLToPath(resolvedPathURL)
      const { config: currentConfig } = await load<Config>({ sources: [{ files: configPath }], cwd: mergedConfig.cwd || process.cwd() })

      if (currentConfig?.extends)
        mergedConfig = await mergeConfigs(currentConfig.extends, mergedConfig)

      mergedConfig = defu(currentConfig, mergedConfig)
    }
    catch (error) {
      throw new OpencclintError(`加载配置文件失败 ${file}: ${error}`)
    }
  }
  return mergedConfig
}

/**
 * 根据提供的选项加载并合并配置文件。
 * @param options 配置选项。
 * @returns 合并后的配置和来源信息。
 */
export async function loadConfig(options?: Partial<LoadConfigOptions>) {
  let { config, sources } = await load<Config>(defu(options, defaultOptions))

  config = defu(config, defaultConfig)

  if (config?.extends) {
    const extendedConfig = await mergeConfigs(config.extends, { cwd: options?.cwd })
    return {
      config: defu(extendedConfig, config),
      sources: [...config.extends, ...sources],
    }
  }

  return { config, sources }
}

/**
 * 全局使用的单例类来管理配置。
 */
export class OpencclintConfig {
  private static instance: OpencclintConfig
  private config: Config
  private sources: string[]

  private constructor() {
    this.config = defaultConfig
    this.sources = []
  }

  public static getInstance(): OpencclintConfig {
    if (!OpencclintConfig.instance)
      OpencclintConfig.instance = new OpencclintConfig()

    return OpencclintConfig.instance
  }

  public async loadConfig(options?: Partial<LoadConfigOptions>): Promise<void> {
    const { config, sources } = await loadConfig(options)
    this.config = config
    this.sources = sources
  }

  public getConfig(): Config {
    return this.config
  }

  public getSources(): string[] {
    return this.sources
  }

  public clear(): void {
    this.config = defaultConfig
    this.sources = []
  }

  public mergeConfig(config: Config): void {
    this.config = defu(config, this.config)
  }

  public async mergeConfigFile(filePath: string): Promise<void> {
    this.config = await mergeConfigs([filePath], this.config)
  }
}
