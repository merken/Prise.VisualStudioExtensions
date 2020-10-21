import { ICommand } from "./command";
import { IFileSystemAbstraction } from "../abstractions/filesystem.abstraction";
import { IDialogAbstraction } from "../abstractions/dialog.abstraction";
import { IPromptAbstraction } from "../abstractions/prompt.abstraction";

export class EmptyDirectoryCommand implements ICommand {
  constructor(
    private dialogAbstraction: IDialogAbstraction,
    private fileSystemAbstraction: IFileSystemAbstraction,
    private promptAbstraction: IPromptAbstraction
  ) { }

  execute(args: any): void {
    if (!args || !args["fsPath"]) {
      return;
    }

    const directory: string = args["fsPath"];
    const messageDir = `${directory.substring(directory.lastIndexOf("/"))}`;
    const message = `Empty this directory (${messageDir}) ?`;
    this.dialogAbstraction.confirm(message).then((yes) => {
      if (yes) {
        if (this.fileSystemAbstraction.emptyDirectory(directory)) {
          this.promptAbstraction.showMessage(
            `Emptied this directory ${messageDir}`
          );
        }
      }
    });
  }
}
