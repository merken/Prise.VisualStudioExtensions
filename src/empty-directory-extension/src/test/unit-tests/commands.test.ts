import assert = require("assert");
import TypeMoq = require("typemoq");
import { DialogAbstraction, IDialogAbstraction } from "../../abstractions/dialog.abstraction";
import { FileSystemAbstraction, IFileSystemAbstraction } from "../../abstractions/filesystem.abstraction";
import { IPromptAbstraction } from "../../abstractions/prompt.abstraction";
import { EmptyDirectoryCommand } from "../../commands/emptydirectory.command";
import { Substitute, Arg } from '@fluffy-spoon/substitute';

describe("EmptyCommand", function () {
  describe("execute", function () {
    // it("should do nothing when invalid args are provided", function () {
    //   const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();
    //   const fileSystemAbstraction = TypeMoq.Mock.ofType<
    //     IFileSystemAbstraction
    //   >();

    //   assert(fileSystemAbstraction.object !== undefined);

    //   new EmptyCommand(
    //     dialogAbstraction.object,
    //     fileSystemAbstraction.object
    //   ).execute(null);

    //   dialogAbstraction.verify(
    //     (f) => f.confirm(TypeMoq.It.isAnyString()),
    //     TypeMoq.Times.never()
    //   );
    //   fileSystemAbstraction.verify(
    //     (f) => f.emptyDirectory(TypeMoq.It.isAnyString()),
    //     TypeMoq.Times.never()
    //   );
    // });

    it("should empty the directory when dialog returns true", function () {
      // const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();

      const dialogAbstraction = Substitute.for<IDialogAbstraction>();
      const fileSystemAbstraction = Substitute.for<IFileSystemAbstraction>();
      const promptAbstraction = Substitute.for<IPromptAbstraction>();
      const testPath: string = "mypath";

      dialogAbstraction.confirm(Arg.any()).resolves(true);
      fileSystemAbstraction.emptyDirectory(testPath).returns(true);
      promptAbstraction.showMessage(Arg.any());

      new EmptyDirectoryCommand(
        dialogAbstraction,
        fileSystemAbstraction,
        promptAbstraction
      ).execute({ fsPath: testPath });

      // promptAbstraction.object.showMessage("");

      // fileSystemAbstraction.object.emptyDirectory("testpath");

      dialogAbstraction.received(1).confirm(Arg.any());

      fileSystemAbstraction.received(1).emptyDirectory(testPath);

      promptAbstraction.received(1).showMessage(Arg.any());
    });

    // it("should empty the directory when dialog returns false", function () {
    //   const dialogAbstraction = TypeMoq.Mock.ofType<IDialogAbstraction>();
    //   const fileSystemAbstraction = TypeMoq.Mock.ofType<
    //     IFileSystemAbstraction
    //   >();

    //   dialogAbstraction
    //     .setup((f) => f.confirm(TypeMoq.It.isAnyString()))
    //     .returns(
    //       () => new Promise<boolean>((r) => r(false))
    //     );

    //   new EmptyCommand(
    //     dialogAbstraction.object,
    //     fileSystemAbstraction.object
    //   ).execute({ fsPath: "testpath" });

    //   fileSystemAbstraction.verify(
    //     (f) => f.emptyDirectory("testpath"),
    //     TypeMoq.Times.never()
    //   );
    // });
  });
});
