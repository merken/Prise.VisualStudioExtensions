"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const filehelper_1 = require("./filehelper");
const processhelper_1 = require("./processhelper");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "prise-publishpluginextension" is now active!');
    let prisepluginfile = vscode.commands.registerCommand('prise-publishpluginextension.prisepluginfile', (args) => {
        if (!args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj"))
            return;
        const csprojFile = args["fsPath"];
        const fileHelper = new filehelper_1.FileHelper(csprojFile);
        fileHelper.createPriseJsonFile();
    });
    let prisenuspecfile = vscode.commands.registerCommand('prise-publishpluginextension.prisenuspecfile', (args) => {
        if (!args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj"))
            return;
        const csprojFile = args["fsPath"];
        const fileHelper = new filehelper_1.FileHelper(csprojFile);
        fileHelper.createPriseNugetFile();
    });
    let publishpriseplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishpriseplugin', (args) => {
        if (!args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj"))
            return;
        const csprojFile = args["fsPath"];
        const processhelper = new processhelper_1.ProcessHelper(csprojFile);
        processhelper.publishPlugin();
    });
    let publishprisenugetplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishprisenugetplugin', (args) => {
        if (!args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj"))
            return;
        const csprojFile = args["fsPath"];
        const processhelper = new processhelper_1.ProcessHelper(csprojFile);
        processhelper.packPlugin();
    });
    context.subscriptions.push(prisepluginfile);
    context.subscriptions.push(prisenuspecfile);
    context.subscriptions.push(publishpriseplugin);
    context.subscriptions.push(publishprisenugetplugin);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map