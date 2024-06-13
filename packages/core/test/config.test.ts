import { resolve } from 'node:path'
import { assert, describe, expect, it } from 'vitest'
import { OpencclintConfig, loadConfig } from '../src'

const rootDir = resolve(__dirname, 'suites')
const basicConfig = {
  conversion: { from: 'cn', to: 'tw' },
  ignoreWords: ['台'],
  exclude: ['dist', 'opencclint.*'],
  fix: false,
}

describe('get-config', () => {
  it('should load config', async () => {
    const cwd = resolve(rootDir, 'basic')
    const { config, sources } = await loadConfig({ cwd })

    expect(config).toEqual(basicConfig)

    expect(sources.map(i => i.slice(cwd.length + 1))).toEqual(['opencclint.config.json'])
  })

  it('should load config with extends', async () => {
    const cwd = resolve(rootDir, 'extends')

    const { config } = await loadConfig({ cwd })

    assert.containsAllKeys(config, ['extends', 'ignoreWords', 'exclude'])
    expect(config.ignoreWords).toContain('extendsNested')
  })

  it('should load config w/ OpencclintConfig', async () => {
    const cwd = resolve(rootDir, 'basic')

    const ocConfig = OpencclintConfig.getInstance()
    await ocConfig.loadConfig({ cwd })

    const config = ocConfig.getConfig()

    expect(config).toEqual(basicConfig)
  })
})
