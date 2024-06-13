# 快速开始

OpenccLint 是一个用于在繁体中文和简体中文之间进行转换和校验的工具。本文将指导您如何快速开始使用 OpenccLint，包括安装 `@opencclint/cli` 并使用 [husky](https://www.npmjs.com/package/husky) 和 [lint-staged](https://www.npmjs.com/package/lint-staged) 进行转换校验。

## 安装 OpenccLint CLI

首先，您需要在项目中安装 OpenccLint CLI 工具。

::: code-group

```sh [npm]
npm install -D @opencclint/cli
```

```sh [yarn]
yarn add -D @opencclint/cli
```

```sh [pnpm]
pnpm add -D @opencclint/cli
```

```sh [bun]
bun add -D @opencclint/cli
```

:::

## 配置 husky 和 lint-staged

为了在提交代码时自动进行繁简体转换校验，我们需要使用 husky 和 lint-staged。

### 安装 husky 和 lint-staged

::: code-group

```sh [npm]
npm install -D husky lint-staged
```

```sh [yarn]
yarn add -D husky lint-staged
```

```sh [pnpm]
pnpm add -D husky lint-staged
```

```sh [bun]
bun add -D husky lint-staged
```

:::

### 初始化 husky

```bash
npx husky init
```

在 `package.json` 中添加以下脚本，以便在安装依赖时自动初始化 husky:

```json
{
  "scripts": {
    "prepare": "husky init"
  }
}
```

### 配置 lint-staged

在 `package.json` 中添加以下配置，以便在提交代码时运行 OpenccLint 校验:

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,vue,json,md}": [
      "opencclint --fix",
      "git add"
    ]
  }
}
```

### 添加 husky 钩子

创建一个 husky 钩子来在提交代码之前运行 lint-staged，在 `.husky/pre-commit` 文件中添加以下内容:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

## 使用 OpenccLint

现在，您可以使用 OpenccLint 进行繁简体转换校验了。

### 手动运行 OpenccLint

您可以手动运行 OpenccLint 来检查和修复文件中的繁简体问题:

```bash
npx opencclint . --fix
```

<!-- 直接运行 `npx opencclint .` 则会在控制台打印出错误，下面是报错的示例:

```bash
OpenccLint result:

/Users/brokenbonesdd/**/index.vue

73:26 error 组 => 組
73:30 error 时机 => 時機
73:33 error 准确 => 準確

✖ Total error count: 3
Time cost: 76.516ms
✨ Recommend to use --fix to fix the errors.
``` -->

### 自动校验

每次提交代码时，husky 和 lint-staged 会自动运行 OpenccLint 来校验和修复代码中的繁简体问题。

## 配置 OpenccLint

您可以在项目根目录下创建一个 `opencclint.config.js` 配置文件来定制 OpenccLint 的行为。以下是一个示例配置:

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
  ],
  exclude: [
    '*.min.*',
    '*.d.ts',
  ],
  fix: false,
}
```

这将配置 OpenccLint 优先使用简体中文，并在发现繁体中文时报错。

## 结语

通过以上步骤，您已经成功配置了 OpenccLint、husky 和 lint-staged 来自动进行繁简体转换校验。这将帮助您在开发过程中保持代码的一致性和规范性。如果有任何问题或需要进一步的帮助，请参考 OpenccLint 的官方文档。

## demo 参考
- [opencclint-demo](https://github.com/hddhyq/opencclint-demo)
- [opencclint-config](https://github.com/hddhyq/opencclint-config)
