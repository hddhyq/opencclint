import vscode from 'vscode'
import { initConfig, watchConfigChange } from './config'
import {
  registerTranslateFileCommand,
  registerTranslateOnSave,
  registerTranslateSelectionCommand,
} from './commands'

const [stopWatchSwtting, stopWatchConfig, stopWatchConfigChange] = watchConfigChange()

export function activate(context: vscode.ExtensionContext) {
  initConfig()

  context.subscriptions.push(
    // commands
    vscode.commands.registerTextEditorCommand('opencclint.translateFile', () => registerTranslateFileCommand(vscode.window.activeTextEditor!)),
    vscode.commands.registerTextEditorCommand('opencclint.translateSelection', () => registerTranslateSelectionCommand(vscode.window.activeTextEditor!)),
    vscode.commands.registerTextEditorCommand('opencclint.translateFileRevert', () => registerTranslateFileCommand(vscode.window.activeTextEditor!, true)),
    vscode.commands.registerTextEditorCommand('opencclint.translateSelectionRevert', () => registerTranslateSelectionCommand(vscode.window.activeTextEditor!, true)),

    // events
    vscode.workspace.onWillSaveTextDocument(registerTranslateOnSave),
  )
}

export function deactivate() {
  stopWatchSwtting.dispose()
  stopWatchConfig.dispose()
  stopWatchConfigChange.dispose()
}
