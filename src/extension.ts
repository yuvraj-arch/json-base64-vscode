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


export function activate(context: ExtensionContext) {

	console.log('Etension "json-base64-vscode" is now active!');

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

	let encodeJsonToBase64Disposable = commands.registerCommand('json-base64-vscode.encodeJsonToBase64', async () => {
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
			if (isValidJson(content)){
				let buff = Buffer.from(content, 'utf8');

				const lastLineId = document.lineCount - 1;
				const range : Range = new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
				const textEdit : TextEdit = TextEdit.replace(range, buff.toString('base64'));
	
				
				await editor.edit((editBuilder) => {
					editBuilder.replace(textEdit.range, textEdit.newText);
				});

				// Display a message box to the user
				window.showInformationMessage('Successfully Encoded Base64 to Json');
			} else {
				window.showInformationMessage('Input text not a valid json');
			} 
		} catch (error) {
			window.showErrorMessage(error.message);
		} finally{
		}
	});
	context.subscriptions.push(decodeBas64ToJsonDisposable, encodeJsonToBase64Disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function isValidJson(str : string) : boolean {
    try {
        JSON.parse(str)
        return true;
    } catch (e) {
        return false;
    }
}
