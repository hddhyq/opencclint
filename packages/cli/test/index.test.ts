import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { execa } from 'execa'

const cli = resolve(__dirname, '../src/index.ts')
const suitesRoot = resolve(__dirname, 'suites')

describe('@opencclint/cli', () => {
  it('should display help information when run with --help', async () => {
    const { stdout } = await execa('esno', [cli, '--help'])
    expect(stdout).toContain('-c, --config <path>')
    expect(stdout).toContain('-i, --ignore <patterns>')
    expect(stdout).toContain('-t, --translate <from2to>')
    expect(stdout).toContain('-t, --translate <from2to>')
  })

  it('should display version information when run with --version', async () => {
    const { stdout } = await execa('esno', [cli, '--version'])
    expect(stdout).toContain('opencclint')
    expect(stdout).toContain('node-')
  })

  it('should lint files w/ log results', async () => {
    const testContent = `console.log('测试opencclint')`
    const lintFile = resolve(suitesRoot, 'index.ts')

    await fs.writeFile(lintFile, testContent, 'utf8')

    try {
      await execa('esno', [cli, lintFile])
    }
    catch (error) {
      // @ts-expect-error add error test case
      const { stdout } = error
      expect(stdout).toContain(`OpenccLint result:`)
      expect(stdout).toContain(`1:14 error 测试 => 測試`)
      expect(stdout).toContain(`✖ Total error count: 1`)
      expect(stdout).toContain(`✨ Recommend to use --fix to fix the errors.`)
    }
  })

  it('should lint files w/ --fix', async () => {
    const testContent = `console.log('测试opencclint')`
    const lintFile = resolve(suitesRoot, 'index.ts')

    await fs.writeFile(lintFile, testContent, 'utf8')

    await execa('esno', [cli, lintFile, '--fix'])

    const result = await fs.readFile(lintFile, 'utf8')

    expect(result).toContain(`console.log('測試opencclint')`)
  })

  it('should lint files w/ --config', async () => {
    const testContent = `console.log('测试opencclint台湾')`
    const lintFile = resolve(suitesRoot, 'index.ts')

    await fs.writeFile(lintFile, testContent, 'utf8')

    await execa('esno', [cli, lintFile, '--config', './packages/core/test/suites/basic/opencclint.config.json', '--fix'])

    const result = await fs.readFile(lintFile, 'utf8')

    expect(result).toContain(`console.log('測試opencclint台灣')`)
  })

  it('should w/ parse options --config', async () => {
    const { stdout } = await execa('esno', [cli, '--config', './packages/core/test/suites/basic/opencclint.config.json'])
    expect(stdout).toContain(`conversion: { from: 'cn', to: 'tw' }`)
    expect(stdout).toContain(`ignoreWords: [ '台' ]`)
    expect(stdout).toContain(`exclude: [ 'dist', 'opencclint.*' ]`)
    expect(stdout).toContain(`fix: false`)
  })

  it('should w/ parse options --ignore', async () => {
    const { stdout } = await execa('esno', [cli, '--ignore', 'dist'])
    expect(stdout).toContain(`exclude: [ 'dist', 'opencclint.*' ]`)
  })

  it('should w/ parse options --exclude', async () => {
    const { stdout } = await execa('esno', [cli, '--exclude', '台,台灣'])
    expect(stdout).toContain(`ignoreWords: [ '台', '台灣' ]`)
  })

  it('should w/ parse options --translate', async () => {
    const { stdout } = await execa('esno', [cli, '--translate', 'cn2tw'])
    expect(stdout).toContain(`conversion: { from: 'cn', to: 'tw' }`)
  })

  it('should w/ parse options --fix', async () => {
    const { stdout } = await execa('esno', [cli, '--fix'])
    expect(stdout).toContain(`fix: true`)
  })

  it('should w/ parse options --translate error', async () => {
    try {
      await execa('esno', [cli, '--translate', 'cn'])
    }
    catch (error) {
      // @ts-expect-error add error test case
      expect(error.stderr).toContain('Invalid translation format. Please use the following format: from2to')
    }
  })

  it('should w/ parse options multiple options', async () => {
    const { stdout } = await execa('esno', [cli, '--fix', '--translate', 'cn2tw', '--exclude', '台,台灣', '--ignore', 'dist'])
    expect(stdout).toContain('ignoreWords: [ \'台\', \'台灣\' ]')
    expect(stdout).toContain(`exclude: [ 'dist', 'opencclint.*' ]`)
    expect(stdout).toContain(`conversion: { from: 'cn', to: 'tw' }`)
    expect(stdout).toContain(`fix: true`)
  })
})
