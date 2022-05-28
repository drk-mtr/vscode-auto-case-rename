import * as vscode from 'vscode';

export class RenameInCurrentFile {

    private static setFirstCharUpper = (str: string) => str[0].toUpperCase() + str.substring(1);

    private static setFirstCharLower = (str: string) => str[0].toLowerCase() + str.substring(1);

    /**
     * Iterate through the current document and replace all instances of words.
     * @param editor The {@link vscode.TextEditor}.
     * @param strToReplace The string to be replaced.
     * @param inputResult The replacement string as input by the user.
     */
    private static replaceLines(
        editor: vscode.TextEditor,
        strToReplace: string,
        inputResult: string) {

        const lineCount = editor.document.lineCount;

        const strToReplaceFirstLower = this.setFirstCharLower(strToReplace);
        const strToReplaceFirstUpper = this.setFirstCharUpper(strToReplace);

        const inputResultFirstLower = this.setFirstCharLower(inputResult);
        const inputResultFirstUpper = this.setFirstCharUpper(inputResult);

        editor.edit(editBuilder => {
            for (let i = 0; i < lineCount; i++) {
                let currentLine = editor.document.lineAt(i);

                let lowerCaseReplacement = currentLine.text
                    .split(strToReplaceFirstLower)
                    .join(inputResultFirstLower);

                let upperCaseReplacement = lowerCaseReplacement
                    .split(strToReplaceFirstUpper)
                    .join(inputResultFirstUpper);

                editBuilder.replace(currentLine.range, upperCaseReplacement);
            }
        });
    }

    /**
     * Get the current selection, or the word at the current cursor position if
     * nothing is selected.
     * @param editor The {@link vscode.TextEditor}.
     */
    private static getCurrentWordOrSelection(editor: vscode.TextEditor) {
        let selection = editor.selection;

        if (selection.isEmpty) {
            let cursorPosition = editor.selection.start;
            let wordRange =
                editor.document.getWordRangeAtPosition(cursorPosition);

            return editor.document.getText(wordRange);
        } else {
            return editor.document.getText(editor.selection);
        }
    }

    /**
     * Replace all instances of words in current document and do case conversion
     * e.g. if string to replace is `adminUser` and replacement string is
     * `normalUser`, then the replacements will be:
     * - `adminUser` -> `normalUser`
     * - `AdminUser` -> `NormalUser`
     */
    public static execute() {
        const window = vscode.window;
        const editor = window.activeTextEditor;

        if (editor) {
            let currentWord = this.getCurrentWordOrSelection(editor);

            let inputBox = window.showInputBox({ value: currentWord });

            inputBox.then(inputResult => {
                if (inputResult) {
                    this.replaceLines(editor, currentWord, inputResult);
                } else {
                    window.showErrorMessage(
                        'Blank string is an invalid replacement value.'
                    );
                }
            });
        }
    }
}