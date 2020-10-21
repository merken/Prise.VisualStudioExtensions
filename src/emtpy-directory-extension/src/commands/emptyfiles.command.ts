import { ICommand } from "./command";
import { IFileSystemAbstraction } from "../abstractions/filesystem.abstraction";
import { IDialogAbstraction } from "../abstractions/dialog.abstraction";
import { IPromptAbstraction } from "../abstractions/prompt.abstraction";

export class EmptyFilesCommand implements ICommand {
    constructor(
        private dialogAbstraction: IDialogAbstraction,
        private fileSystemAbstraction: IFileSystemAbstraction,
        private promptAbstraction: IPromptAbstraction
    ) { }

    execute(args: any): void {
        if (!args || !args["fsPath"]) {
            return;
        }

        const directory = args["fsPath"];
        const messageDir = `${directory.substring(directory.lastIndexOf("/"))}`;
        const message = `Remove all files this directory (${messageDir}) ?`;
        Promise.resolve(true).then(() => {
            this.dialogAbstraction.confirm(message).then((yes) => {
                if (yes) {
                    if (this.fileSystemAbstraction.emptyFiles(directory)) {
                        this.promptAbstraction.showMessage(
                            `Files deleted from ${messageDir}`
                        );
                    }
                }
            });
        });

    }
}