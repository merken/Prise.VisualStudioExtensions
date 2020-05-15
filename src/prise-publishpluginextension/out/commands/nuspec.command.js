"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuspecCommand = void 0;
class NuspecCommand {
    constructor(fileHelper) {
        this.fileHelper = fileHelper;
    }
    execute(args) {
        if (!args ||
            !args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj")) {
            return;
        }
        this.fileHelper.createPriseNuspecFile(args["fsPath"]);
    }
}
exports.NuspecCommand = NuspecCommand;
//# sourceMappingURL=nuspec.command.js.map