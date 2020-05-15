"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrisePluginCommand = void 0;
class PrisePluginCommand {
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
        this.fileHelper.createPriseJsonFile(args["fsPath"]);
    }
}
exports.PrisePluginCommand = PrisePluginCommand;
//# sourceMappingURL=prise-plugin.command.js.map