# OpenccLint 配置

## 概述

`OpenccLint` 利用 [unconfig](https://github.com/antfu/unconfig) 读取配置，支持多种文件格式如 `TypeScript`、`JavaScript`、`JSON` 和 `YAML` 等格式。这种多样性允许用户根据个人或团队的编程习惯选择最适合的配置方式。

### 支持的配置文件格式

`OpenccLint` 通过 `unconfig` 支持以下配置文件格式：

- **JavaScript**：`opencclint.config.js`
- **JSON**：`opencclint.config.json`
- **YAML**：`opencclint.config.yaml` 或 `opencclint.config.yml`

尽管这些格式在语法上有所不同，但它们都遵循相同的配置结构。

## 配置项详解

### 1. `extends`

- **类型**：`string[]`
- **描述**：允许继承和复用一组预定义的配置文件。路径应为可解析的模块或文件路径。

### 2. `conversion`

- **类型**：`object`
- **描述**：定义文本转换的语言方向，详细配置可参考 [opencc-js](https://github.com/nk2028/opencc-js#api)：
  - **from**：源语言设置，例如 'cn' 代表中国大陆简体中文。
  - **to**：目标语言设置，例如 'tw' 代表台湾地区繁体中文。

### 3. `ignoreWords`

- **类型**：`string[]`
- **描述**：列出在转换过程中将被忽略的词汇。这些词汇在转换时保持不变。

### 4. `exclude`

- **类型**：`string[]`
- **描述**：定义应在转换过程中忽略的文件和目录的模式。支持通配符，以便灵活配置。

:::tip
忽略模式遵循 [.gitignore spec 2.22.1](https://git-scm.com/docs/gitignore) 的规范，并使用 [ignore](https://github.com/kaelzhang/node-ignore) 库来执行忽略操作。
:::

### 5. `fix`

- **类型**：`boolean`
- **默认值**：`false`
- **描述**：指定是否自动修复可修复的问题。启用后，`OpenccLint` 会尝试自动修正已识别的问题。

## 使用示例

以下是一个 `JavaScript` 配置文件示例：

```js
module.exports = {
  extends: [
    'opencclint-config'
  ],
  conversion: {
    from: 'cn',
    to: 'tw',
  },
  ignoreWords: [
    '台',
    '里',
    '周',
    '占',
    '伙',
    '松',
    '爱',
    '庄',
    '后',
    '了',
    '裏',
    '范',
    '布',
    '叁',
    '吃',
    '毀',
    '秘籍',
    '奇岩',
    '家俱',
    '家具',
    '收佣',
    '覈查',
    '爲準',
  ],
  exclude: [
    '*.min.*',
    '*.d.ts',
    'CHANGELOG.md',
    'dist',
    'LICENSE*',
    'output',
    'out',
    'coverage',
    'public',
    'temp',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    '.github',
    '.vitepress',
    '.vscode',
    'node_modules',
    'opencclint.*',
  ],
  fix: false,
}
```

## 注意事项

- 确保选择的配置文件格式正确，并遵循相应的语法规则。
- 适当配置 `exclude` 可以提高处理速度，特别是在大型项目中。
