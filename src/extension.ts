import * as vscode from 'vscode';
import { RenameInCurrentFile } from './rename-in-current-file';

// Called when your extension is activated (i.e. the very first time the
// command is executed.
export function activate(context: vscode.ExtensionContext) {
    // The command is defined in the package.json file.
    // The commandId parameter must match the command field in package.json.
    let disposable = vscode.commands.registerCommand('auto-case-rename.renameInCurrentFile', () => {
        RenameInCurrentFile.execute();
    });

    context.subscriptions.push(disposable);
}

// This method is called when the extension is deactivated.
export function deactivate() {}
