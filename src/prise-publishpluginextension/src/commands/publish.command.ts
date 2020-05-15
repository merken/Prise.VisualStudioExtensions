import { ICommand } from "./command";
import { ProcessHelper } from "../processhelper";

export class PublishCommand implements ICommand {

	constructor(private processHelper: ProcessHelper) { }

	execute(args: any): void {
		if (!args ||
			!args["scheme"] ||
			args["scheme"] !== "file" ||
			!args["fsPath"] ||
			!args["fsPath"].endsWith(".csproj")
		) {
			return;
		}

		this.processHelper.publishPlugin(args["fsPath"]);
	}
}