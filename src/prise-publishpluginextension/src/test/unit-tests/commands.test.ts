import assert = require('assert');
import TypeMoq = require('typemoq');
import { FileHelper } from '../../filehelper';
import { NuspecCommand } from '../../commands/nuspec.command';
import { PackCommand } from '../../commands/pack.command';
import { ProcessHelper } from '../../processhelper';
import { PublishCommand } from '../../commands/publish.command';
import { PrisePluginCommand } from '../../commands/prise-plugin.command';

describe('NuspecCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType<FileHelper>();
            new NuspecCommand(helper.object).execute(null);
            new NuspecCommand(helper.object).execute({"scheme" : "test"});
            new NuspecCommand(helper.object).execute({"scheme" : "file"});
            new NuspecCommand(helper.object).execute({"scheme" : "file", "fsPath": "file.txt"});
            helper.verify(f => f.createPriseNuspecFile(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});

describe('PackCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType<ProcessHelper>();
            new PackCommand(helper.object).execute(null);
            new PackCommand(helper.object).execute({"scheme" : "test"});
            new PackCommand(helper.object).execute({"scheme" : "file"});
            new PackCommand(helper.object).execute({"scheme" : "file", "fsPath": "file.txt"});
            helper.verify(f => f.packPlugin(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});

describe('PrisePluginCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType<FileHelper>();
            new PrisePluginCommand(helper.object).execute(null);
            new PrisePluginCommand(helper.object).execute({"scheme" : "test"});
            new PrisePluginCommand(helper.object).execute({"scheme" : "file"});
            new PrisePluginCommand(helper.object).execute({"scheme" : "file", "fsPath": "file.txt"});
            helper.verify(f => f.createPriseJsonFile(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});

describe('PublishCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType<ProcessHelper>();
            new PublishCommand(helper.object).execute(null);
            new PublishCommand(helper.object).execute({"scheme" : "test"});
            new PublishCommand(helper.object).execute({"scheme" : "file"});
            new PublishCommand(helper.object).execute({"scheme" : "file", "fsPath": "file.txt"});
            helper.verify(f => f.publishPlugin(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});