// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-base64-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let decodeBas64ToJsonDisposable = vscode.commands.registerCommand('json-base64-vscode.decodeBas64ToJson', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from decodeBas64ToJson!');
	});

	let encodeJsonToBase64Disposable = vscode.commands.registerCommand('json-base64-vscode.encodeJsonToBase64', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from encodeJsonToBase64!');
	});
	context.subscriptions.push(decodeBas64ToJsonDisposable, encodeJsonToBase64Disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
