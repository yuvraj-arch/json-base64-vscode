// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as prettier from 'prettier';


export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "Decoder/Decoder - Json/Base64" is now active!');

	let decodeBas64ToJsonDisposable = vscode.commands.registerCommand('json-base64-vscode.decodeBas64ToJson', async () => {
		try {
			
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('Not able to get text!');
					return;
			}
			const document = editor.document;
			const content: any = document.getText();
			if (content === '') {
				vscode.window.showInformationMessage('Error:: Text not available!');
					return;
			}
			let buff = Buffer.from(content, 'base64');
			 
			const message = prettier.format(buff.toString('utf8'), {bracketSpacing:false, trailingComma: "es5", tabWidth: 4, 
			semi: false, singleQuote: true,  parser: "json-stringify",}).trim();
			
			const lastLineId = document.lineCount - 1;
			const range : vscode.Range = new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
			const textEdit : vscode.TextEdit = vscode.TextEdit.replace(range, message);

			
			await editor.edit((editBuilder) => {
				editBuilder.replace(textEdit.range, textEdit.newText);
			});
			vscode.languages.setTextDocumentLanguage(editor.document, 'json');
			// Display a message box to the user
			vscode.window.showInformationMessage('Successfully Decoded Base64 to Json');
			goToStartingPosition(editor)
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}
	});

	let encodeJsonToBase64Disposable = vscode.commands.registerCommand('json-base64-vscode.encodeJsonToBase64', async () => {
		try {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('Not able to get text!');
					return;
			}
			vscode.ConfigurationTarget.Workspace
			const document = editor.document;
			const content: any = document.getText();
			if (content === '') {
				vscode.window.showErrorMessage('Error:: Text not available!');
					return;
			}
			let buff : Buffer;
			try {
					buff = Buffer.from(JSON.stringify(JSON.parse(content)), 'utf8');
			} catch (error) {
				vscode.window.showErrorMessage('Error:: Input text not a valid json');
				return;
			}

			const lastLineId = document.lineCount - 1;
			const range : vscode.Range = new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
			const textEdit : vscode.TextEdit = vscode.TextEdit.replace(range, buff.toString('base64'));
	
			await editor.edit((editBuilder) => {
				editBuilder.replace(textEdit.range, textEdit.newText);
			});

			/*const wordWrap = vscode.workspace.getConfiguration('', document).get('editor.wordWrap');
			if('off' === wordWrap) {
				vscode.commands.executeCommand('editor.action.toggleWordWrap');
			}*/
			// Display a message box to the user
			vscode.languages.setTextDocumentLanguage(editor.document, 'plaintext');
			vscode.window.showInformationMessage('Successfully Encoded Base64 to Json');
			goToStartingPosition(editor)
		} catch (error) {
			vscode.window.showErrorMessage(error.message);
		}
	});
	context.subscriptions.push(decodeBas64ToJsonDisposable, encodeJsonToBase64Disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function goToStartingPosition(textEditor: vscode.TextEditor) : void {
    if (!textEditor) return;
    const position = new vscode.Position(0, 0);
    textEditor.selection = new vscode.Selection(position, position);
    textEditor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.Default);
}

