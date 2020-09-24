import { ICommand } from "./command";
import { IFileSystemAbstraction } from "../abstractions/filesystem.abstraction";
import { IDialogAbstraction } from "../abstractions/dialog.abstraction";

export class EmptyCommand implements ICommand {
  constructor(
    private dialogAbstraction: IDialogAbstraction,
    private fileSystemAbstraction: IFileSystemAbstraction
  ) {}

  execute(args: any): void {
    if (!args || !args["fsPath"]) {
      return;
    }

    const directory = args["fsPath"];

    this.dialogAbstraction
      .confirm(`Empty this directory (${directory}) ?`)
      .then((yes) => {
        if (yes) {
          if (this.fileSystemAbstraction.emptyDirectory(directory)) {
            console.log("Deleted");
          }
        }
      });
  }
}
