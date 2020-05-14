// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import { FileHelper } from './filehelper';
import { ProcessHelper } from './processhelper';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "prise-publishpluginextension" is now active!');

	let prisepluginfile = vscode.commands.registerCommand('prise-publishpluginextension.prisepluginfile', (args: any) => {
		if (!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		)
			return;

		const csprojFile = args["fsPath"];
		const fileHelper = new FileHelper(csprojFile);
		fileHelper.createPriseJsonFile();
	});

	let prisenuspecfile = vscode.commands.registerCommand('prise-publishpluginextension.prisenuspecfile', (args: any) => {
		if (!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		)
			return;

		const csprojFile = args["fsPath"];
		const fileHelper = new FileHelper(csprojFile);
		fileHelper.createPriseNugetFile();
	});

	let publishpriseplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishpriseplugin', (args: any) => {
		if (!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		)
			return;

		const csprojFile = args["fsPath"];
		const processhelper = new ProcessHelper(csprojFile);
		processhelper.publishPlugin();
	});

	let publishprisenugetplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishprisenugetplugin', (args: any) => {
		if (!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		)
			return;

		const csprojFile = args["fsPath"];
		const processhelper = new ProcessHelper(csprojFile);
		processhelper.packPlugin();
	});

	context.subscriptions.push(prisepluginfile);
	context.subscriptions.push(prisenuspecfile);
	context.subscriptions.push(publishpriseplugin);
	context.subscriptions.push(publishprisenugetplugin);
}

// this method is called when your extension is deactivated
export function deactivate() { }
