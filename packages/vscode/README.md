# opencclint README

使用 opencc 转换繁简体，可添加多种自定义配置，如忽略文字，忽略文件，保存自动转换。

## 特性

- [文件转换繁简体](#文件转换繁简体)。
- [文本选中转换繁简体](#文本选中转换繁简体)。
- [保存文件自动转换繁简体](#保存文件自动转换繁简体)。
- [转换快捷键](#快捷键列表)。
- [可配置忽略文件、忽略文件夹、忽略词组](#配置文件)。
- 撤销文件转换繁简体。
- 撤销文本选中转换繁简体。
- 代码行内禁用转换识别。
- 配置文件支持 `extends` 属性。

### 文件转换繁简体

参考[示例文件夹](/example)配置。

#### 使用方法

- 当前文件，使用快捷键：`Ctrl+Alt+O` 在 Windows 和 Linux 上，或 `Ctrl+CMD+O` 在 OSX 上。
- 当前文件，调出命令面板（`F1`，或 `Ctrl+Shift+P` 在 Windows 和 Linux 上，或 `Shift+CMD+P` 在 OSX 上），输入`OpenccLint: Translate File`。

#### 示例

![文件转换繁简体](./images/file.gif)

### 文本选中转换繁简体

#### 使用方法

- 选中文本，使用右键菜单，点击: `OpenccLint: Translate Selection` 选项。
- 选中文本，使用快捷键 `Ctrl+Alt+P` 在 Windows 和 Linux 上，或 `Ctrl+CMD+P` 在 OSX 上。
- 选中文本，调出命令面板（F1，或 `Ctrl+Shift+P` 在 Windows 和 Linux 上，或 `Shift+CMD+P` 在 OSX 上），输入`OpenccLint: Translate Selection`。

#### 示例

![文本选中转换繁简体](./images/selection.gif)

### 保存文件自动转换繁简体

#### 使用方法

需要在[配置文件](#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)中开启 `"opencclint.autoFixOnSave": true`。

```jsonc
{
  "opencclint.autoFixOnSave": true
}
```

#### 示例

![保存自动转换](./images/autoSave.gif)

## 配置文件

- `ignoreWords`: 需要忽略的文本，如：台湾 => 台(~~臺~~)灣。
- `exclude`: 需要排除的文件或文件夾，參照：[.gitignore spec 2.22.1](https://git-scm.com/docs/gitignore)

根目录添加 `.opencclintrc.json` 文件。文件格式参考 [unconfig](https://github.com/antfu/unconfig)支持

```js
// opencclint.config.ts
export default {
  extends: [
    '@**/opencclint-config',
  ],
  ignoreWords: [
    '台',
  ],
  exclude: [
    'dist',
    'docs',
    'packages',
    'scripts',
  ],
}
```

## 插件配置

| 配置                          | 默认值                                                                            | 备注                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `opencclint.converterOptions` | `cn=>tw`                                                                          | opencc 转换配置项, ["cn", "tw", "twp", "hk", "jp", "t"] 参考：[api](https://github.com/nk2028/opencc-js#api) |
| `opencclint.autoFixOnSave`    | `false`                                                                           | 是否开启自动保                                                                                  |

## 指令列表

| 指令                                            | 描述                       |
| ----------------------------------------------- | -------------------------- |
| `OpenccLint: Translate File`                    | 转换当前文件繁简体         |
| `OpenccLint: Translate Selection`               | 转换当前选中文本繁简体     |
| `onCommand:opencclint.translateFile`            | 转换当前文件繁简体         |
| `onCommand:opencclint.translateFileRevert`      | 撤销当前选中文本繁简体转换     |
| `onCommand:opencclint.translateSelection`       | 转换当前选中文本繁简体     |
| `onCommand:opencclint.translateSelectionRevert` | 撤销当前选中文本繁简体转换 |

## 快捷键列表

| 快捷键                                          | 描述                       |
| ----------------------------------------------- | -------------------------- |
| `Ctrl+Alt+O` 或 `Ctrl+CMD+O`                    | 转换当前文件繁简体            |
| `Ctrl+Alt+Shift+O` 或 `Ctrl+CMD+Shift+O`        | 撤销当前选中文本繁简体转换     |
| `Ctrl+Alt+P` 或 `Ctrl+CMD+P`                    | 转换当前选中文本繁简体         |
| `Ctrl+Alt+Shift+P` 或 `Ctrl+CMD+Shift+P`        | 撤销当前选中文本繁简体转换     |

## 感谢

- [OpenCC](https://github.com/BYVoid/OpenCC)
- [opencc-js](https://github.com/nk2028/opencc-js)
