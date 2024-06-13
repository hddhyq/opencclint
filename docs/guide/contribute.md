# 贡献指南

感谢您的帮助 👋

## 起步

- 我们使用 [pnpm](https://pnpm.js.org/) 来管理依赖。可以通过 `npm i -g pnpm` 安装它。
- 使用 `pnpm i` 安装依赖。
- 使用 `pnpm build` 构建所有包。

### 包结构

- `@opencclint/core` 包含 OpenCCLint 的核心逻辑。发布为 `@opencclint/core`。
- `@opencclint/cli` 是一个命令行工具，主要依赖 `@opencclint/core`。发布为 `@opencclint/cli`。
- `vscode-opencclint` 是一个 VSCode 插件，主要依赖 `@opencclint/core`。发布为 `vscode-opencclint`。

### 测试

- 我们使用 [Vitest](https://vitest.dev) 来测试代码库。运行 `pnpm test` 启动测试运行器。

### 代码规范

- 我们使用 ESLint 来格式化代码库。在您提交之前，所有文件都会被自动格式化。
- 我们使用 [Conventional Commits](https://www.conventionalcommits.org/zh/v1.0.0/) 规范。请使用前缀。如果您的 PR 中有多个提交且其中一些不符合 Conventional Commits 规则，我们将进行 squash 合并。
