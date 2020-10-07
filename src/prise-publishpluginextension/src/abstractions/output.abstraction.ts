import * as vscode from "vscode";

//This abstracts away the vscode output window
export class OutputAbstraction {
  constructor(private outputChannel: vscode.OutputChannel) {}

  public writeOutput(output: string): void {
    this.outputChannel.append(output);
  }

  public message(message: string): void {
    vscode.window.showInformationMessage(message);
  }

  public error(error: string): void {
    vscode.window.showErrorMessage(error);
  }
}
