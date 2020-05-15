"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackCommand = void 0;
class PackCommand {
    constructor(processHelper) {
        this.processHelper = processHelper;
    }
    execute(args) {
        if (!args ||
            !args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj")) {
            return;
        }
        this.processHelper.packPlugin(args["fsPath"]);
    }
}
exports.PackCommand = PackCommand;
//# sourceMappingURL=pack.command.js.map