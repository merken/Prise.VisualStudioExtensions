import { ICommand } from "./command";
import { FileHelper } from "../filehelper";

export class PrisePluginCommand implements ICommand {

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

		this.fileHelper.createPriseJsonFile(args["fsPath"]);
	}
}