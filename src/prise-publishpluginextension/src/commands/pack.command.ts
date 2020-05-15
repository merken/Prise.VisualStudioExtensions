import { ICommand } from "./command";
import { OutputAbstraction } from "../abstractions/output.abstraction";
import { ProcessHelper } from "../processhelper";

export class PackCommand implements ICommand {

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
		this.processHelper.packPlugin(args["fsPath"]);
	}
}