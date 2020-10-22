import { IDialogAbstraction } from "../../abstractions/dialog.abstraction";
import { IFileSystemAbstraction } from "../../abstractions/filesystem.abstraction";
import { IPromptAbstraction } from "../../abstractions/prompt.abstraction";
import { EmptyDirectoryCommand } from "../../commands/emptydirectory.command";
import { Substitute, Arg } from '@fluffy-spoon/substitute';

describe("EmptyCommand", function () {
  describe("execute", function () {
    it("should do nothing when invalid args are provided", async function () {
      const dialogAbstraction = Substitute.for<IDialogAbstraction>();
      const fileSystemAbstraction = Substitute.for<IFileSystemAbstraction>();
      const promptAbstraction = Substitute.for<IPromptAbstraction>();
      const testPath: string = "mypath";

      dialogAbstraction.confirm(Arg.any()).resolves(true);
      fileSystemAbstraction.emptyDirectory(testPath).returns(true);
      promptAbstraction.showMessage(Arg.any());

      const command = new EmptyDirectoryCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      );
      await command.execute(null);

      dialogAbstraction.received(0).confirm(Arg.any());
      fileSystemAbstraction.received(0).emptyDirectory(testPath);
      promptAbstraction.received(0).showMessage(Arg.any());
    });

    it("should empty the directory when dialog returns true", async function () {
      const dialogAbstraction = Substitute.for<IDialogAbstraction>();
      const fileSystemAbstraction = Substitute.for<IFileSystemAbstraction>();
      const promptAbstraction = Substitute.for<IPromptAbstraction>();
      const testPath: string = "mypath";

      dialogAbstraction.confirm(Arg.any()).resolves(true);
      fileSystemAbstraction.emptyDirectory(testPath).returns(true);
      promptAbstraction.showMessage(Arg.any());

      const command = new EmptyDirectoryCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      );
      await command.execute({ fsPath: testPath });

      dialogAbstraction.received(1).confirm(Arg.any());
      fileSystemAbstraction.received(1).emptyDirectory(testPath);
      promptAbstraction.received(1).showMessage(Arg.any());
    });

    it("should empty the directory when dialog returns false", async function () {
      const dialogAbstraction = Substitute.for<IDialogAbstraction>();
      const fileSystemAbstraction = Substitute.for<IFileSystemAbstraction>();
      const promptAbstraction = Substitute.for<IPromptAbstraction>();
      const testPath: string = "mypath";

      dialogAbstraction.confirm(Arg.any()).resolves(false);
      
      const command = new EmptyDirectoryCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      );
      await command.execute({ fsPath: testPath });

      dialogAbstraction.received(1).confirm(Arg.any());
      fileSystemAbstraction.received(0).emptyDirectory(testPath);
      promptAbstraction.received(0).showMessage(Arg.any());
    });
  });
});
