import * as path from 'node:path'
import * as vscode from 'vscode'
import { OpencclintConfig, getIsIgnored, translateCore } from '../../../core/src'

const ocInstance = OpencclintConfig.getInstance()

// 在文件保存后执行翻译
export async function registerTranslateOnSave(document: vscode.TextDocument) {
  // 尝试获取工作区的根文件夹路径，如果没有工作区则为空数组
  const workspaceFolders = vscode.workspace.workspaceFolders || []
  const rootFolderPath = workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : null
  // 获取当前文档的文件路径
  const documentPath = document.uri.fsPath
  const relativePath = rootFolderPath ? documentPath.replace(`${rootFolderPath}`, '').split(path.sep).join(path.posix.sep).substring(1) : ''

  const config = ocInstance.getConfig()

  if (!config.fix)
    return

  if (!relativePath || getIsIgnored(relativePath))
    return

  try {
    // 获取保存后的文档内容
    const fullText = document.getText()
    const result = await translateCore(fullText, config)

    // 如果有需要转换的内容，直接应用更改
    if (result.positions.length > 0) {
      // 应用更改
      const edit = new vscode.WorkspaceEdit()
      result.positions.forEach((position) => {
        const range = new vscode.Range(document.positionAt(position.start), document.positionAt(position.end))
        const replacement = result.modified.substring(position.start, position.end)
        edit.replace(document.uri, range, replacement)
      })

      // 直接应用编辑，不再依赖查找可见的编辑器
      await vscode.workspace.applyEdit(edit)
    }
  }
  catch (error) {
    console.error('Failed to translate document:', error)
    vscode.window.showErrorMessage('Failed to translate document. See console for details.')
  }
}
