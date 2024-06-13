# VSCode 插件

OpenccLint 是一个强大的工具，用于在繁简体中文之间进行转换。通过在 Visual Studio Code（VS Code）中安装和配置 OpenccLint 插件，您可以轻松地在编辑器中进行繁简体转换，提高工作效率。以下是如何在 VS Code 中使用 OpenccLint 繁简体转换插件的详细步骤。

## 安装插件

1. **打开 VS Code**:
   启动您的 VS Code 编辑器。

2. **进入扩展视图**:
   单击左侧活动栏中的扩展图标，或者按下快捷键 `Ctrl+Shift+X`（Windows/Linux）或 `Cmd+Shift+X`（macOS）。

3. **搜索 OpenccLint**:
   在扩展视图的搜索栏中输入 "OpenccLint"，然后按下回车键。

4. **安装插件**:
   在搜索结果中找到 OpenccLint 插件，点击 `安装` 按钮进行安装。

## 配置插件

安装完成后，您需要进行一些配置以便插件能够正常工作。

1. **打开设置**:
   点击左下角齿轮图标，选择 `设置`，或者按下快捷键 `Ctrl+,`（Windows/Linux）或 `Cmd+,`（macOS）。

2. **搜索 OpenccLint 配置**:
   在设置搜索栏中输入 "OpenccLint"。

3. **配置转换选项**:
   根据需要配置以下选项：
   - `opencclint.autoFixOnSave`: 保存文本自动转换。
   - `opencclint.config`: 指定 OpenccLint 配置文件路径。
   - `opencclint.converterOptions`: 指定转换选项，如 `cn=>tw`（简体转繁体）或 `tw=>cn`（繁体转简体）。
   - `opencclint.exclude`: 指定不需要转换的文件或文件夹。
   - `opencclint.ignoreWords`: 指定不需要转换的词语。

## 使用插件

### 文件转换繁简体

#### 使用方法

- 当前文件，使用快捷键：`Ctrl+Alt+O` 在 Windows 和 Linux 上，或 `Ctrl+CMD+O` 在 OSX 上。
- 当前文件，调出命令面板（`F1`，或 `Ctrl+Shift+P` 在 Windows 和 Linux 上，或 `Shift+CMD+P` 在 OSX 上），输入`OpenccLint: Translate File`。

### 文本选中转换繁简体

#### 使用方法

- 选中文本，使用右键菜单，点击: `OpenccLint: Translate Selection` 选项。
- 选中文本，使用快捷键 `Ctrl+Alt+P` 在 Windows 和 Linux 上，或 `Ctrl+CMD+P` 在 OSX 上。
- 选中文本，调出命令面板（F1，或 `Ctrl+Shift+P` 在 Windows 和 Linux 上，或 `Shift+CMD+P` 在 OSX 上），输入`OpenccLint: Translate Selection`。

### 保存文件自动转换繁简体

#### 使用方法

需要在配置文件中开启 `"opencclint.autoFixOnSave": true`。

```jsonc
{
  "opencclint.autoFixOnSave": true
}
```

### 配置文件

参照[配置](/guide/config.html)

## 示例

假设您有以下繁体中文文本：

```plaintext
這是一個測試。
```

选择该文本并使用 OpenccLint 插件进行转换后，文本将变为：

```plaintext
这是一个测试。
```

## 常见问题

- **插件无法正常工作**:
  - 确保您已正确安装和配置 OpenccLint 插件。
  - 检查 VSCode 是否为最新版本，并尝试重新启动编辑器。

- **转换结果不正确**:
  - 确认您选择了正确的转换命令（简体或繁体）。
  - 检查文本是否包含特殊字符或格式，可能会影响转换结果。

通过以上步骤，您可以在 VSCode 编辑器中轻松使用 OpenccLint 插件进行繁简体转换，提高您的工作效率。具体使用说明，参照 VSCode 插件[文档](https://marketplace.visualstudio.com/items?itemName=brokenbonesdd.opencclint)。
