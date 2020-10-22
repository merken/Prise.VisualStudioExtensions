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

  async execute(args: any): Promise<void> {
    if (!args || !args["fsPath"]) {
      return Promise.resolve();
    }

    const directory = args["fsPath"];
    const messageDir = `${directory.substring(directory.lastIndexOf("/"))}`;
    const message = `Empty this directory (${messageDir}) ?`;
    const confirmed = await this.dialogAbstraction.confirm(message);

    if (confirmed) {
      if (this.fileSystemAbstraction.emptyDirectory(directory)) {
        this.promptAbstraction.showMessage(
          `Emptied this directory ${messageDir}`
        );
      }
    }
  }
}
