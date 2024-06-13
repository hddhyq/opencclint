import * as path from 'node:path'
import * as vscode from 'vscode'
import { OpencclintConfig, getIsIgnored, translateCore } from '../../../core/src'

const ocInstance = OpencclintConfig.getInstance()

export async function registerTranslateOnSave(event: vscode.TextDocumentWillSaveEvent) {
  const { document, waitUntil } = event
  const textEditor = vscode.window.activeTextEditor

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

  async function textEdit() {
    try {
      const fullText = document.getText()
      const result = await translateCore(fullText, config)
      return textEditor!.edit((editBuilder) => {
        result.positions.forEach((position) => {
          const range = new vscode.Range(document.positionAt(position.start), document.positionAt(position.end))
          const replacement = result.modified.substring(position.start, position.end)
          editBuilder.replace(range, replacement)
        })
      })
    }
    catch (error) {
      console.error('Failed to translate document:', error)
      vscode.window.showErrorMessage('Failed to translate document. See console for details.')
    }
  }

  waitUntil(textEdit())
}
