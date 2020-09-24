import * as vscode from "vscode";
import { DialogAbstraction } from "./abstractions/dialog.abstraction";
import { FileSystemAbstraction } from "./abstractions/filesystem.abstraction";
import { EmptyCommand } from "./commands/empty.command";

export function activate(context: vscode.ExtensionContext) {
  //Singleton output window instance
  const dialogAbstraction = new DialogAbstraction();
  const fileSystemAbstraction = new FileSystemAbstraction();

  let emptydirectory = vscode.commands.registerCommand(
    "empty-directory-extension.emptydirectory",
    (args: any) => {
      new EmptyCommand(dialogAbstraction, fileSystemAbstraction).execute(args);
    }
  );

  context.subscriptions.push(emptydirectory);
}

export function deactivate() {}
