"use strict";
import * as fs from "fs";
import * as os from "os";
import { basename, dirname, extname, join } from "path";
import * as vscode from "vscode";
import path = require("path");
const TmpDir = os.tmpdir();

export class FileHelper implements vscode.Disposable {
    private absolutePathToCsProj: string;
    private outputChannel: vscode.OutputChannel;

    constructor(absolutePathToCsProj: string) {
        this.absolutePathToCsProj = absolutePathToCsProj;
        this.outputChannel = vscode.window.createOutputChannel("Code");
    }

    toAbsolutePath(nameOrRelativePath: string): string {
        // simple test for slashes in the param
        if (/\/|\\/.test(nameOrRelativePath)) {
            return path.resolve(this.workspaceRoot, nameOrRelativePath);
        }

        // if it's just the name of the duck, 
        // assume that it will be in 'src/state/ducks/'
        return path.resolve(this.workspaceRoot, this.defaultPath,
            nameOrRelativePath);
    }

    public createPriseJsonFile(): void {
        
    }

    public createPriseNugetFile(): void {

    }

    public dispose() {
    }
}