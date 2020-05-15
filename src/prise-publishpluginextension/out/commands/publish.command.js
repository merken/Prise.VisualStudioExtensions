"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishCommand = void 0;
class PublishCommand {
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
        this.processHelper.publishPlugin(args["fsPath"]);
    }
}
exports.PublishCommand = PublishCommand;
//# sourceMappingURL=publish.command.js.map