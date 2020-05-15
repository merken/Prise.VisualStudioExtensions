"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputAbstraction = void 0;
const vscode = require("vscode");
//This abstracts away the vscode output window
class OutputAbstraction {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
    }
    writeOutput(output) {
        this.outputChannel.append(output);
    }
    error(error) {
        vscode.window.showErrorMessage(error);
    }
}
exports.OutputAbstraction = OutputAbstraction;
//# sourceMappingURL=output.abstraction.js.map