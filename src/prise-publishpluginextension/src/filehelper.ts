"use strict";
import * as fs from "fs";
import { basename, dirname, extname, join } from "path";
import * as vscode from "vscode";

export class FileHelper implements vscode.Disposable {
    private absolutePathToCsProj: string;

    private priseJsonFileTemplate: any = {
        publishDir: "<path to host application .\\bin\\Debug\\netcoreappx.x\\Plugins>",
        configuration: "Debug",
        nuspecFile: null,
        includeProjectNameInPublishDir: false
    };

    private getPriseNuspecFileTemplate(projectName: string, targetFramework: string): string {
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
        <file src="${join("bin", "Debug", targetFramework, "publish", "*.*")}" target="${join("lib", targetFramework)}" />
    </files>
</package>`;
    }

    constructor(absolutePathToCsProj: string) {
        this.absolutePathToCsProj = absolutePathToCsProj;
    }

    private getTargetFramework(): string {
        const projectFileContents = fs.readFileSync(this.absolutePathToCsProj, 'utf8');
        var targetFrameworkRegex = new RegExp("<TargetFramework>(.*?)</TargetFramework>", "gmi");
        var targetFrameworkRegexResults = targetFrameworkRegex.exec(projectFileContents);
        if (!targetFrameworkRegexResults)
            throw new Error(`${projectFileContents} could not be parsed`);

        return targetFrameworkRegexResults[1];
    }

    private getProjectName(): string {
        return basename(this.absolutePathToCsProj, '.csproj');
    }

    public createPriseJsonFile(): void {
        const pathToCsprojFile = dirname(this.absolutePathToCsProj);
        const pathToJsonFile = join(pathToCsprojFile, "prise.plugin.json");
        if(fs.existsSync(pathToJsonFile)){
            vscode.window.showInformationMessage(`prise.plugin.json already exists at ${pathToJsonFile}`);
            return;
        }

        fs.writeFile(pathToJsonFile, JSON.stringify(this.priseJsonFileTemplate), err => {
            if (err) {
                return vscode.window.showErrorMessage(
                    "Failed to create prise.plugin.json file!"
                );
            }
            vscode.window.showInformationMessage(`prise.plugin.json created at ${pathToJsonFile}`);
        });
    }

    public createPriseNugetFile(): void {
        const pathToCsprojFile = dirname(this.absolutePathToCsProj);
        const projectName = this.getProjectName();
        const targetFramework = this.getTargetFramework();
        const nuspecFile = `${projectName}.nuspec`;
        const pathToNuspecFile = join(pathToCsprojFile, nuspecFile);
        if(fs.existsSync(pathToNuspecFile)){
            vscode.window.showInformationMessage(`${nuspecFile} already exists at ${pathToNuspecFile}`);
            return;
        }

        fs.writeFile(
            pathToNuspecFile, 
            this.getPriseNuspecFileTemplate(projectName, targetFramework), 
            err => {
            if (err) {
                return vscode.window.showErrorMessage(
                    `Failed to create ${nuspecFile} file!`
                );
            }

            vscode.window.showInformationMessage(`${nuspecFile} created at ${pathToNuspecFile}`);
        });
    }

    public dispose() {
    }
}