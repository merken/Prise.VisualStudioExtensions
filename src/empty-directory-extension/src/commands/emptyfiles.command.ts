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

    async execute(args: any): Promise<void> {
        if (!args || !args["fsPath"]) {
            return Promise.resolve();
        }

        const directory = args["fsPath"];
        const messageDir = `${directory.substring(directory.lastIndexOf("/"))}`;
        const message = `Remove all files this directory (${messageDir}) ?`;
        const confirmed = await this.dialogAbstraction.confirm(message);

        if (confirmed) {
            if (this.fileSystemAbstraction.emptyFiles(directory)) {
                this.promptAbstraction.showMessage(
                    `Files deleted from ${messageDir}`
                );
            }
        }
    }
}