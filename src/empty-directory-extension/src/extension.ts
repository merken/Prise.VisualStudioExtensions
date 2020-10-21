import * as vscode from "vscode";
import { DialogAbstraction } from "./abstractions/dialog.abstraction";
import { FileSystemAbstraction } from "./abstractions/filesystem.abstraction";
import { PromptAbstraction } from "./abstractions/prompt.abstraction";
import { EmptyDirectoryCommand } from "./commands/emptydirectory.command";
import { EmptyFilesCommand } from "./commands/emptyfiles.command";

export function activate(context: vscode.ExtensionContext) {
  //Singleton output window instance
  const dialogAbstraction = new DialogAbstraction();
  const fileSystemAbstraction = new FileSystemAbstraction();
  const promptAbstraction = new PromptAbstraction();

  let emptydirectory = vscode.commands.registerCommand(
    "empty-directory-extension.emptydirectory",
    (args: any) => {
      new EmptyDirectoryCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      ).execute(args);
    }
  );

  let emptyfiles = vscode.commands.registerCommand(
    "empty-directory-extension.emptyfiles",
    (args: any) => {
      new EmptyFilesCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      ).execute(args);
    }
  );

  context.subscriptions.push(emptydirectory);
  context.subscriptions.push(emptyfiles);
}

export function deactivate() {}
