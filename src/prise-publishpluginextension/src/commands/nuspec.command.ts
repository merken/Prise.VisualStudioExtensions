import { ICommand } from "./command";
import { FileHelper } from "../filehelper";
import { OutputAbstraction } from "../abstractions/output.abstraction";

export class NuspecCommand implements ICommand {

	constructor(private fileHelper: FileHelper) { }

	execute(args: any): void {
		if (!args ||
			!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		) {
			return;
		}

		this.fileHelper.createPriseNuspecFile(args["fsPath"]);
	}
}