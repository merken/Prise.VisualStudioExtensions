"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const os = require("os");
const vscode = require("vscode");
const path = require("path");
const TmpDir = os.tmpdir();
class FileHelper {
    constructor(absolutePathToCsProj) {
        this.absolutePathToCsProj = absolutePathToCsProj;
        this.outputChannel = vscode.window.createOutputChannel("Code");
    }
    toAbsolutePath(nameOrRelativePath) {
        // simple test for slashes in the param
        if (/\/|\\/.test(nameOrRelativePath)) {
            return path.resolve(this.workspaceRoot, nameOrRelativePath);
        }
        // if it's just the name of the duck, 
        // assume that it will be in 'src/state/ducks/'
        return path.resolve(this.workspaceRoot, this.defaultPath, nameOrRelativePath);
    }
    createPriseJsonFile() {
    }
    createPriseNugetFile() {
    }
    dispose() {
    }
}
exports.FileHelper = FileHelper;
//# sourceMappingURL=filehelper.js.map