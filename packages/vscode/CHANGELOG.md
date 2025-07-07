# Change Log

## 0.0.1(2022-07-26)

feat: 添加命令行转换文件

## 0.0.2(2022-08-15)

feat: 添加自动保存转换功能及配置文件。

## 0.0.3(2022-12-14)

fix: [#2](https://github.com/hddhyq/vscode-opencclint/issues/2) 修复 twp=>cn 模式下，转换异常。

## 0.0.4(2022-12-17)

fix: 修复 translateSelection 转换异常。

## 0.0.5(2023-7-27)

fix: [#5](https://github.com/hddhyq/vscode-opencclint/issues/5) 修复 Mac keybinding 冲突。

## 0.0.6(2023-12-28)

- chore: 更新 OpenccLint 配置和指令。
- feat: 添加 `onCommand:opencclint.translateFileRevert` 撤销当前文件繁简体转换
- feat: 添加 `onCommand:opencclint.translateSelectionRevert` 撤销当前选中文本繁简体转换

## 2.0.5(2024-05-16)

- feat: 支持识别禁用转换识别。(opencclint-disabled等)
- chore: 重构代码。

## 2.0.8(2025-07-07)

- fix: 修复在Cursor中自动保存转换功能，替换保存时机，改为在保存后150ms执行。