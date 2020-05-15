"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const prise_plugin_command_1 = require("./commands/prise-plugin.command");
const output_abstraction_1 = require("./abstractions/output.abstraction");
const nuspec_command_1 = require("./commands/nuspec.command");
const publish_command_1 = require("./commands/publish.command");
const pack_command_1 = require("./commands/pack.command");
const filehelper_1 = require("./filehelper");
const processhelper_1 = require("./processhelper");
function activate(context) {
    //Singleton output window instance
    const outputAbstraction = new output_abstraction_1.OutputAbstraction(vscode.window.createOutputChannel('Prise'));
    let prisepluginfile = vscode.commands.registerCommand('prise-publishpluginextension.prisepluginfile', (args) => {
        new prise_plugin_command_1.PrisePluginCommand(new filehelper_1.FileHelper(outputAbstraction)).execute(args);
    });
    let prisenuspecfile = vscode.commands.registerCommand('prise-publishpluginextension.prisenuspecfile', (args) => {
        new nuspec_command_1.NuspecCommand(new filehelper_1.FileHelper(outputAbstraction)).execute(args);
    });
    let publishpriseplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishpriseplugin', (args) => {
        new publish_command_1.PublishCommand(new processhelper_1.ProcessHelper(outputAbstraction)).execute(args);
    });
    let publishprisenugetplugin = vscode.commands.registerCommand('prise-publishpluginextension.publishprisenugetplugin', (args) => {
        new pack_command_1.PackCommand(new processhelper_1.ProcessHelper(outputAbstraction)).execute(args);
    });
    context.subscriptions.push(prisepluginfile);
    context.subscriptions.push(prisenuspecfile);
    context.subscriptions.push(publishpriseplugin);
    context.subscriptions.push(publishprisenugetplugin);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map