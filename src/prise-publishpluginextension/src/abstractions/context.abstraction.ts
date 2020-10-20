import * as vscode from "vscode";
import * as fs from "fs";

export interface IContextAbstraction {
  startListening(context: vscode.ExtensionContext): void;

  pluginFileCreated(): void;

  nuspecFileCreated(): void;
}

export class ContextAbstraction implements IContextAbstraction {
  constructor(private context: vscode.ExtensionContext) { }

  startListening(): void {
    const setPriseContext = () => {
      const isCsProjSelected = vscode.window?.activeTextEditor?.document.fileName.endsWith(
        ".csproj"
      );
      if (!isCsProjSelected) {
        return;
      }

      const hasPriseReference = vscode.window?.activeTextEditor?.document
        .getText()
        .indexOf("Prise.Plugin");
      if (!hasPriseReference) {
        return;
      }

      this.setContext("prise:isPriseProject", true);

      const pathToCsProj =
        vscode.window?.activeTextEditor?.document.uri.fsPath ?? "";
      const isWindows = pathToCsProj.indexOf('\\') > 0;
      const separatorChar = isWindows ? '\\' : '/';
      const pathToProjectDir = pathToCsProj.substring(
        0,
        pathToCsProj.lastIndexOf(separatorChar)
      );

      const hasPrisePluginFile = fs.existsSync(
        `${pathToProjectDir}/prise.plugin.json`
      );
      this.setContext("prise:hasPrisePluginFile", hasPrisePluginFile);

      const projectName = pathToCsProj
        .substring(pathToCsProj.lastIndexOf(separatorChar) + 1)
        .replace(".csproj", "");
      const hasNuspecFile = fs.existsSync(
        `${pathToProjectDir}/${projectName}.nuspec`
      );
      this.setContext("prise:hasNuspecFile", hasNuspecFile);
    };

    vscode.window.onDidChangeActiveTextEditor(
      setPriseContext,
      null,
      this.context.subscriptions
    );
    setPriseContext();
  }

  pluginFileCreated(): void {
    this.setContext("prise:hasPrisePluginFile", true);
  }

  nuspecFileCreated(): void {
    this.setContext("prise:hasNuspecFile", true);
  }

  private setContext(parameter: string, value: any): void {
    vscode.commands.executeCommand("setContext", parameter, value);
  }
}