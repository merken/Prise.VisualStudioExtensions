import * as vscode from "vscode";
import { PrisePluginCommand } from "./commands/prise-plugin.command";
import { OutputAbstraction } from "./abstractions/output.abstraction";
import { NuspecCommand } from "./commands/nuspec.command";
import { PublishCommand } from "./commands/publish.command";
import { PackCommand } from "./commands/pack.command";
import { FileHelper } from "./filehelper";
import { ProcessHelper } from "./processhelper";
import { ContextAbstraction } from "./abstractions/context.abstraction";

export function activate(context: vscode.ExtensionContext) {
  //Singleton output window instance
  const outputAbstraction = new OutputAbstraction(
    vscode.window.createOutputChannel("Prise")
  );

  const contextAbstraction = new ContextAbstraction(context);

  contextAbstraction.startListening();

  let prisepluginfile = vscode.commands.registerCommand(
    "prise-publishpluginextension.prisepluginfile",
    (args: any) => {
      new PrisePluginCommand(
        new FileHelper(outputAbstraction, contextAbstraction)
      ).execute(args);
    }
  );

  let prisenuspecfile = vscode.commands.registerCommand(
    "prise-publishpluginextension.prisenuspecfile",
    (args: any) => {
      new NuspecCommand(
        new FileHelper(outputAbstraction, contextAbstraction)
      ).execute(args);
    }
  );

  let publishpriseplugin = vscode.commands.registerCommand(
    "prise-publishpluginextension.publishpriseplugin",
    (args: any) => {
      new PublishCommand(new ProcessHelper(outputAbstraction)).execute(args);
    }
  );

  let publishprisenugetplugin = vscode.commands.registerCommand(
    "prise-publishpluginextension.publishprisenugetplugin",
    (args: any) => {
      new PackCommand(new ProcessHelper(outputAbstraction)).execute(args);
    }
  );

  context.subscriptions.push(prisepluginfile);
  context.subscriptions.push(prisenuspecfile);
  context.subscriptions.push(publishpriseplugin);
  context.subscriptions.push(publishprisenugetplugin);
}

export function deactivate() {}
