"use strict";
import * as fs from "fs";
import { dirname, resolve, join, isAbsolute } from "path";
import * as cp from "child_process";
import { ProjectHelper } from "./projecthelper";
import { OutputAbstraction } from "./abstractions/output.abstraction";

export class ProcessHelper {
  constructor(private outputAbstraction: OutputAbstraction) {}

  private getPrisePluginConfig(absolutePathToCsProj: string): any {
    const priseConfigFilePath = join(
      dirname(absolutePathToCsProj),
      "prise.plugin.json"
    );
    if (!fs.existsSync(priseConfigFilePath)) {
      this.outputAbstraction.error(
        `prise.plugin.json does not exists at ${priseConfigFilePath}`
      );
      return;
    }

    const priseConfigContents = fs.readFileSync(priseConfigFilePath, "utf8");
    return JSON.parse(priseConfigContents);
  }

  public async publishPlugin(absolutePathToCsProj: string) {
    const config = this.getPrisePluginConfig(absolutePathToCsProj);
    if (!config) {
      return;
    }

    const workingDir = dirname(absolutePathToCsProj);
    const projectName = ProjectHelper.getProjectName(absolutePathToCsProj);
    const targetFramework = ProjectHelper.getTargetFramework(
      absolutePathToCsProj
    );
    const configuration = config.configuration ?? "Debug";
    let publishDir = config.publishDir;

    if (!isAbsolute(publishDir)) {
      publishDir = resolve(workingDir, publishDir);
    }

    if (config.includeProjectNameInPublishDir) {
      publishDir = join(publishDir, projectName);
    }

    if (!fs.existsSync(publishDir)) {
      this.outputAbstraction.error(
        `Publish dir does not exists: ${publishDir}`
      );
      return;
    }

    await this.dotnet(
      "clean",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`
    );

    await this.dotnet(
      "build",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`
    );

    await this.dotnet(
      "publish",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`,
      publishDir
    );

    this.outputAbstraction.message(`Published ${projectName} to ${publishDir}`);
  }

  public async packPlugin(absolutePathToCsProj: string) {
    const config = this.getPrisePluginConfig(absolutePathToCsProj);
    if (!config) {
      return;
    }

    const workingDir = dirname(absolutePathToCsProj);
    const projectName = ProjectHelper.getProjectName(absolutePathToCsProj);
    const targetFramework = ProjectHelper.getTargetFramework(
      absolutePathToCsProj
    );
    const configuration = config.configuration ?? "Debug";
    let nuspecFile =
      config.nuspecFile ?? `${projectName.split(".csproj")[0]}.nuspec`;
    let publishPath = config.publishDir;

    if (!isAbsolute(publishPath)) {
      publishPath = resolve(workingDir, publishPath);
    }

    if (!isAbsolute(nuspecFile)) {
      nuspecFile = resolve(workingDir, nuspecFile);
    }

    if (!fs.existsSync(publishPath)) {
      this.outputAbstraction.error(
        `Publish dir does not exists: ${publishPath}`
      );
      return;
    }

    if (!fs.existsSync(nuspecFile)) {
      this.outputAbstraction.error(
        `NuSpec file does not exists: ${nuspecFile}`
      );
      return;
    }

    await this.dotnet(
      "clean",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`
    );

    await this.dotnet(
      "build",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`
    );

    const publishDir = await this.dotnet(
      "publish",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`
    );

    this.changeLastWriteTime(resolve(workingDir, publishDir));

    await this.dotnet(
      "pack",
      projectName,
      targetFramework,
      workingDir,
      configuration,
      `${projectName}.csproj`,
      publishPath,
      nuspecFile
    );

    this.outputAbstraction.message(`Packaged ${projectName} to ${publishPath}`);
  }

  private changeLastWriteTime(outputDir: string) {
    var files = fs.readdirSync(outputDir);
    const searchTime = new Date(2000, 1, 1);
    for (var i = 0; i < files.length; i++) {
      var filename = join(outputDir, files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        this.changeLastWriteTime(filename); //recurse
      } else if (filename.indexOf(".dll") >= 0) {
        var stats = fs.statSync(filename);
        var mtime = stats.mtime;
        if (mtime < searchTime) {
          mtime.setFullYear(mtime.getFullYear() + 20);
          fs.utimesSync(filename, mtime, mtime);
        }
      }
    }
  }

  private dotnet(
    command: string,
    projectName: string,
    targetFramework: string,
    workingDir: string,
    configuration: string,
    projectFile: string,
    outputPath?: string,
    nuspecFile?: string
  ): Promise<string> {
    return new Promise((resolve) => {
      let options = { cwd: workingDir };
      let args = [command, "--configuration", configuration, projectFile];
      if (outputPath) {
        args = [...args, "--output", outputPath];
      }

      if(nuspecFile){
        args = [...args, `/p:nuspecfile=${nuspecFile}`];
      }

      let childProcess = cp.spawn(`dotnet`, args, options);

      if (childProcess.pid) {
        childProcess.stdout.on("data", (data: Buffer) => {
          this.outputAbstraction.writeOutput(data.toString());
        });
        childProcess.stdout.on("end", () => {
          const output =
            outputPath ??
            join("bin", configuration, targetFramework, "publish");
          resolve(output);
        });
      }
    });
  }
}
