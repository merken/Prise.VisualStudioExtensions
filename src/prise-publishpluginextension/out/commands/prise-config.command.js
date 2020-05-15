"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriseConfigCommand = void 0;
const filehelper_1 = require("../filehelper");
class PriseConfigCommand {
    execute(args) {
        if (!args["scheme"] ||
            args["scheme"] !== "file" ||
            !args["fsPath"] ||
            !args["fsPath"].endsWith(".csproj")) {
            return;
        }
        const csprojFile = args["fsPath"];
        const fileHelper = new filehelper_1.FileHelper(csprojFile, outputChannel);
        fileHelper.createPriseJsonFile();
    }
}
exports.PriseConfigCommand = PriseConfigCommand;
//# sourceMappingURL=prise-config.command.js.map