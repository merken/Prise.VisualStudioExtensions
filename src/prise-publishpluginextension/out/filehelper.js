"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
const fs = require("fs");
const path_1 = require("path");
const vscode = require("vscode");
class FileHelper {
    constructor(absolutePathToCsProj) {
        this.priseJsonFileTemplate = {
            publishDir: "<path to host application .\\bin\\Debug\\netcoreappx.x\\Plugins>",
            configuration: "Debug",
            nuspecFile: null,
            includeProjectNameInPublishDir: false
        };
        this.absolutePathToCsProj = absolutePathToCsProj;
    }
    getPriseNuspecFileTemplate(projectName, targetFramework) {
        return `<?xml version="1.0"?>
<package>
    <metadata>
        <id>${projectName}</id>
        <title>${projectName}</title>
        <version>1.0.0</version>
        <authors>TODO</authors>
        <owners>TODO</owners>
        <description>${projectName}</description>
        <copyright>Copyright ${new Date().getFullYear()}</copyright>
        <tags></tags>
    </metadata>
    <files>
        <file src="${path_1.join("bin", "Debug", targetFramework, "publish", "*.*")}" target="${path_1.join("lib", targetFramework)}" />
    </files>
</package>`;
    }
    getTargetFramework() {
        const projectFileContents = fs.readFileSync(this.absolutePathToCsProj, 'utf8');
        var targetFrameworkRegex = new RegExp("<TargetFramework>(.*?)</TargetFramework>", "gmi");
        var targetFrameworkRegexResults = targetFrameworkRegex.exec(projectFileContents);
        if (!targetFrameworkRegexResults)
            throw new Error(`${projectFileContents} could not be parsed`);
        return targetFrameworkRegexResults[1];
    }
    getProjectName() {
        return path_1.basename(this.absolutePathToCsProj, '.csproj');
    }
    createPriseJsonFile() {
        const pathToCsprojFile = path_1.dirname(this.absolutePathToCsProj);
        const pathToJsonFile = path_1.join(pathToCsprojFile, "prise.plugin.json");
        if (fs.existsSync(pathToJsonFile)) {
            vscode.window.showInformationMessage(`prise.plugin.json already exists at ${pathToJsonFile}`);
            return;
        }
        fs.writeFile(pathToJsonFile, JSON.stringify(this.priseJsonFileTemplate), err => {
            if (err) {
                return vscode.window.showErrorMessage("Failed to create prise.plugin.json file!");
            }
            vscode.window.showInformationMessage(`prise.plugin.json created at ${pathToJsonFile}`);
        });
    }
    createPriseNugetFile() {
        const pathToCsprojFile = path_1.dirname(this.absolutePathToCsProj);
        const projectName = this.getProjectName();
        const targetFramework = this.getTargetFramework();
        const nuspecFile = `${projectName}.nuspec`;
        const pathToNuspecFile = path_1.join(pathToCsprojFile, nuspecFile);
        if (fs.existsSync(pathToNuspecFile)) {
            vscode.window.showInformationMessage(`${nuspecFile} already exists at ${pathToNuspecFile}`);
            return;
        }
        fs.writeFile(pathToNuspecFile, this.getPriseNuspecFileTemplate(projectName, targetFramework), err => {
            if (err) {
                return vscode.window.showErrorMessage(`Failed to create ${nuspecFile} file!`);
            }
            vscode.window.showInformationMessage(`${nuspecFile} created at ${pathToNuspecFile}`);
        });
    }
    dispose() {
    }
}
exports.FileHelper = FileHelper;
//# sourceMappingURL=filehelper.js.map