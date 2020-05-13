// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "prise-publishpluginextension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let prisepluginfile = vscode.commands.registerCommand('prise-publishpluginextension.prisepluginfile', () => {
		// The code you place here will be executed every time your command is executed

		const wsedit = new vscode.WorkspaceEdit();
		const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
		const filePath = vscode.Uri.file(wsPath + '/hello/world.md');
		vscode.window.showInformationMessage(filePath.toString());
		wsedit.createFile(filePath, { ignoreIfExists: true });
		vscode.workspace.applyEdit(wsedit);
		vscode.window.showInformationMessage('Created a new file: hello/world.md');
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Prise.PublishPluginExtension!');
	});

	let prisenuspecfile = vscode.commands.registerCommand('prise-publishpluginextension.prisenuspecfile', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Prise.PublishPluginExtension!');
	});

	let publishpriseplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishpriseplugin', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Prise.PublishPluginExtension!');
	});

	let publishprisenugetplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishprisenugetplugin', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Prise.PublishPluginExtension!');
	});

	context.subscriptions.push(prisepluginfile);
	context.subscriptions.push(prisenuspecfile);
	context.subscriptions.push(publishpriseplugin);
	context.subscriptions.push(publishprisenugetplugin);
}

// this method is called when your extension is deactivated
export function deactivate() { }
