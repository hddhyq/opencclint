import * as vscode from 'vscode'
import { OpencclintConfig, translateCore } from '../../../core/src'

const ocInstance = OpencclintConfig.getInstance()

/**
 * Registers a command to translate the entire file content.
 * @param textEditor The active text editor.
 * @param isRevert Indicates if the translation should be reverted.
 */
export async function registerTranslateFileCommand(textEditor: vscode.TextEditor, isRevert: boolean = false) {
  const document: vscode.TextDocument = textEditor.document
  const fullText = document.getText()

  // Retrieve the current configuration and adjust if revert is needed.
  let config = ocInstance.getConfig()

  if (isRevert && config.conversion)
    config = { ...config, conversion: { from: config.conversion.to, to: config.conversion.from } }

  try {
    const result = await translateCore(fullText, config)
    // Apply the translation results to the document.
    await textEditor.edit((editBuilder) => {
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
