import * as vscode from 'vscode'
import { OpencclintConfig, translateCore } from '../../../core/src'

const ocInstance = OpencclintConfig.getInstance()

/**
 * Registers a command to translate the entire file content.
 * @param textEditor The active text editor.
 * @param isRevert Indicates if the translation should be reverted.
 */
export async function registerTranslateSelectionCommand(textEditor: vscode.TextEditor, isRevert: boolean = false) {
  const document: vscode.TextDocument = textEditor.document
  const selection = textEditor.selection
  const text = document.getText(selection)

  // Retrieve the current configuration and adjust if revert is needed.
  let config = ocInstance.getConfig()

  if (isRevert && config.conversion)
    config = { ...config, conversion: { from: config.conversion.to, to: config.conversion.from } }

  try {
    const result = await translateCore(text, config)
    const selectionStart = document.offsetAt(textEditor.selection.start)

    // Apply the translation results to the document.
    await textEditor.edit((editBuilder) => {
      result.positions.forEach((position) => {
        const range = new vscode.Range(
          document.positionAt(selectionStart + position.start),
          document.positionAt(selectionStart + position.end),
        )
        const replacement = result.modified.substring(position.start, position.end)
        editBuilder.replace(range, replacement)
      })
    })
  }
  catch (error) {
    console.error('Failed to translate section:', error)
    vscode.window.showErrorMessage('Failed to translate section. See console for details.')
  }
}
