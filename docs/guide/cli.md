# @opencclint/cli

在命令行中使用 OpenccLint。

## 使用方法

可以直接使用

```bash
npx @opencclint/cli README.md
```

## 安装

你可以将它全局安装，命令别名有 @opencclint/cli、opencclint。

```bash
npm install -g @opencclint/cli

opencclint src/index.ts
```

## 选项

OpenccLint 提供了多个命令行选项，允许用户自定义行为：

- `-c, --config <path>`：指定自定义配置文件的路径。(如果未指定，工具将默认查找根目录下的 opencclint.config.*)
- `-e, --exclude <patterns>`：指定要排除的词汇，使用逗号分隔。例如：台,台湾。
- `-i, --ignore <patterns>`：指定要忽略的文件或目录的模式，使用逗号分隔。
- `-t, --translate <from2to>`：指定转换的源语言和目标语言。例如：cn=>tw。
- `--fix`：自动修复检测到的问题。

### Lint 文件

```bash
opencclint [...files]
```

此命令用于检查指定的文件。您可以列出一个、多个文件或者目录作为参数。

### 示例

检查并自动修复项目中的文件：

```bash
opencclint src/**/*.js --fix
```

使用指定的语言转换设置，转换特定文件：

```bash
opencclint src/index.js --translate cn2tw
```

忽略特定模式的文件：

```bash
opencclint src --ignore node_modules,build
```

排除特定词汇：

```bash
opencclint src --exclude 台,台湾
```

### 版本和帮助

- 查看工具版本：`opencclint --version`
- 获取帮助信息：`opencclint --help`

## 注意事项

确保在运行命令时正确指定了所有必要的选项和参数。不正确的命令可能会导致不预期的行为或错误。
