"use strict";
import * as fs from "fs";
import { basename, dirname, resolve, join, isAbsolute, relative } from "path";
import * as vscode from "vscode";
import * as cp from 'child_process';

export class ProcessHelper implements vscode.Disposable {
    private outputChannel: vscode.OutputChannel;
    private absolutePathToCsProj: string;

    constructor(absolutePathToCsProj: string) {
        this.outputChannel = vscode.window.createOutputChannel("Prise");
        this.absolutePathToCsProj = absolutePathToCsProj;
    }

    private getPrisePluginConfig(): any {
        const priseConfigFilePath = join(dirname(this.absolutePathToCsProj), "prise.plugin.json");
        if (!fs.existsSync(priseConfigFilePath)) {
            vscode.window.showErrorMessage(`prise.plugin.json does not exists at ${priseConfigFilePath}`);
            return;
        }

        const priseConfigContents = fs.readFileSync(priseConfigFilePath, 'utf8');
        return JSON.parse(priseConfigContents);
    }

    private getProjectName(): string {
        return basename(this.absolutePathToCsProj, '.csproj');
    }

    private getTargetFramework(): string {
        const projectFileContents = fs.readFileSync(this.absolutePathToCsProj, 'utf8');
        var targetFrameworkRegex = new RegExp("<TargetFramework>(.*?)</TargetFramework>", "gmi");
        var targetFrameworkRegexResults = targetFrameworkRegex.exec(projectFileContents);
        if (!targetFrameworkRegexResults)
            throw new Error(`${projectFileContents} could not be parsed`);

        return targetFrameworkRegexResults[1];
    }

    public async publishPlugin() {
        const config = this.getPrisePluginConfig();
        if (!config)
            return;

        const workingDir = dirname(this.absolutePathToCsProj);
        const projectName = this.getProjectName();
        const targetFramework = this.getTargetFramework();
        const configuration = config.configuration ?? "Debug";
        let publishPath = config.publishDir;

        if (!isAbsolute(publishPath))
            publishPath = resolve(workingDir, publishPath);

        if (config.includeProjectNameInPublishDir)
            publishPath = join(publishPath, projectName);

        if (!fs.existsSync(publishPath)) {
            vscode.window.showErrorMessage(`Publish dir does not exists: ${publishPath}`);
            return;
        }

        await this.dotnet("publish", projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`, publishPath);
    }

    public async packPlugin() {
        const config = this.getPrisePluginConfig();
        if (!config)
            return;

        const workingDir = dirname(this.absolutePathToCsProj);
        const projectName = this.getProjectName();
        const targetFramework = this.getTargetFramework();
        const configuration = config.configuration ?? "Debug";
        let nuspecFile = config.nuspecFile ?? `${projectName.split(".csproj")[0]}.nuspec`;
        let publishPath = config.publishDir;

        if (!isAbsolute(publishPath))
            publishPath = resolve(workingDir, publishPath);

        if (!isAbsolute(nuspecFile))
            nuspecFile = resolve(workingDir, nuspecFile);

        if (!fs.existsSync(publishPath)) {
            vscode.window.showErrorMessage(`Publish dir does not exists: ${publishPath}`);
            return;
        }

        if (!fs.existsSync(nuspecFile)) {
            vscode.window.showErrorMessage(`NuSpec file does not exists: ${nuspecFile}`);
            return;
        }

        const outputDir = await this.dotnet("publish", projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`);

        this.changeLastWriteTime(resolve(workingDir, outputDir));

        await this.dotnet("pack", projectName, targetFramework, workingDir, configuration, `${projectName}.csproj`, publishPath);
    }

    private changeLastWriteTime(outputDir: string) {
        var files = fs.readdirSync(outputDir);
        const searchTime = new Date(2000, 1, 1);
        for (var i = 0; i < files.length; i++) {
            var filename = join(outputDir, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()) {
                this.changeLastWriteTime(filename); //recurse
            }
            else if (filename.indexOf(".dll") >= 0) {
                var stats = fs.statSync(filename);
                var mtime = stats.mtime;
                if (mtime < searchTime) {
                    mtime.setFullYear(mtime.getFullYear() + 20);
                    fs.utimesSync(filename, mtime, mtime);
                }
            };
        };
    }

    private dotnet(command: string,
        projectName: string,
        targetFramework: string,
        workingDir: string,
        configuration: string,
        projectFile: string,
        outputPath?: string): Promise<string> {
        return new Promise(resolve => {
            let options = { cwd: workingDir };
            let args = [command, '--configuration', configuration, projectFile];
            if (outputPath)
                args = [...args, '--output', outputPath];

            let childProcess = cp.spawn(`dotnet`, args, options);

            if (childProcess.pid) {
                childProcess.stdout.on('data', (data: Buffer) => {
                    this.outputChannel.append(data.toString());
                });
                childProcess.stdout.on('end', () => {
                    const output = outputPath ?? join("bin", configuration, targetFramework, "publish");
                    this.outputChannel.append(`Published ${projectName} to ${output}`);
                    resolve(output);
                });
            }
        });
    }

    public dispose() {
    }
}
