"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeMoq = require("typemoq");
const nuspec_command_1 = require("../../commands/nuspec.command");
const pack_command_1 = require("../../commands/pack.command");
const publish_command_1 = require("../../commands/publish.command");
const prise_plugin_command_1 = require("../../commands/prise-plugin.command");
describe('NuspecCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType();
            new nuspec_command_1.NuspecCommand(helper.object).execute(null);
            new nuspec_command_1.NuspecCommand(helper.object).execute({ "scheme": "test" });
            new nuspec_command_1.NuspecCommand(helper.object).execute({ "scheme": "file" });
            new nuspec_command_1.NuspecCommand(helper.object).execute({ "scheme": "file", "fsPath": "file.txt" });
            helper.verify(f => f.createPriseNuspecFile(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});
describe('PackCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType();
            new pack_command_1.PackCommand(helper.object).execute(null);
            new pack_command_1.PackCommand(helper.object).execute({ "scheme": "test" });
            new pack_command_1.PackCommand(helper.object).execute({ "scheme": "file" });
            new pack_command_1.PackCommand(helper.object).execute({ "scheme": "file", "fsPath": "file.txt" });
            helper.verify(f => f.packPlugin(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});
describe('PrisePluginCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType();
            new prise_plugin_command_1.PrisePluginCommand(helper.object).execute(null);
            new prise_plugin_command_1.PrisePluginCommand(helper.object).execute({ "scheme": "test" });
            new prise_plugin_command_1.PrisePluginCommand(helper.object).execute({ "scheme": "file" });
            new prise_plugin_command_1.PrisePluginCommand(helper.object).execute({ "scheme": "file", "fsPath": "file.txt" });
            helper.verify(f => f.createPriseJsonFile(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});
describe('PublishCommand', function () {
    describe('execute', function () {
        it('should do nothing when invalid args are provided', function () {
            const helper = TypeMoq.Mock.ofType();
            new publish_command_1.PublishCommand(helper.object).execute(null);
            new publish_command_1.PublishCommand(helper.object).execute({ "scheme": "test" });
            new publish_command_1.PublishCommand(helper.object).execute({ "scheme": "file" });
            new publish_command_1.PublishCommand(helper.object).execute({ "scheme": "file", "fsPath": "file.txt" });
            helper.verify(f => f.publishPlugin(TypeMoq.It.isAnyString()), TypeMoq.Times.never());
        });
    });
});
//# sourceMappingURL=commands.test.js.map