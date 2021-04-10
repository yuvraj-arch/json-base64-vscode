// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
	languages, 
	ExtensionContext,
	commands, 
	window, 
	Range,
	TextEdit,} from 'vscode';
import * as prettier from 'prettier';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-base64-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let decodeBas64ToJsonDisposable = commands.registerCommand('json-base64-vscode.decodeBas64ToJson', async () => {
		try {
			const editor = window.activeTextEditor;
			if (!editor) {
				window.showInformationMessage('Not able to get text!');
					return;
			}
			const document = editor.document;
			const content: any = document.getText();
			if (content === '') {
				window.showInformationMessage('Text not available!');
					return;
			}
			let buff = Buffer.from(content, 'base64');
			 
			const message = prettier.format(buff.toString('utf8'), {bracketSpacing:false, trailingComma: "es5", tabWidth: 4, 
			semi: false, singleQuote: true,  parser: "json-stringify",}).trim();
			
			const lastLineId = document.lineCount - 1;
			const range : Range = new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
			const textEdit : TextEdit = TextEdit.replace(range, message);

			
			await editor.edit((editBuilder) => {
				editBuilder.replace(textEdit.range, textEdit.newText);
			});
			languages.setTextDocumentLanguage(editor.document, 'json');
			// Display a message box to the user
			window.showInformationMessage('Successfully Decoded Base64 to Json');
			} catch (error) {
				window.showErrorMessage(error.message);
			} finally{
			}
	});

	let encodeJsonToBase64Disposable = commands.registerCommand('json-base64-vscode.encodeJsonToBase64', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		window.showInformationMessage('Hello World from encodeJsonToBase64!');
	});
	context.subscriptions.push(decodeBas64ToJsonDisposable, encodeJsonToBase64Disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
