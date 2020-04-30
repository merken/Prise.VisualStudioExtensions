using System;
using System.ComponentModel.Design;
using System.IO;
using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Newtonsoft.Json;

namespace Prise.PublishPluginExtension
{
    /// <summary>
    /// Command handler
    /// </summary>
    internal sealed class CreatePrisePluginFileCommand
    {
        public const int CommandId = 0x0100;
        private readonly Package _package;
        private readonly DTE _dte;

        private CreatePrisePluginFileCommand(Package package)
        {
            _package = package ?? throw new ArgumentNullException("package");
            _dte = ServiceProvider.GetService(typeof(DTE)) as DTE;

            if (ServiceProvider.GetService(typeof(IMenuCommandService)) is OleMenuCommandService commandService)
            {
                var menuCommandID = new CommandID(Constants.PublishPluginCommandSet, CommandId);
                var menuItem = new OleMenuCommand(MenuItemCallback, menuCommandID);
                menuItem.BeforeQueryStatus += MenuItem_BeforeQueryStatus;
                commandService.AddCommand(menuItem);
            }
        }

        private void MenuItem_BeforeQueryStatus(object sender, EventArgs e) =>
            ((OleMenuCommand)sender).Enabled = !ProjectHelper.DoesPrisePluginFileExist(_dte);

        public static CreatePrisePluginFileCommand Instance
        {
            get;
            private set;
        }

        private IServiceProvider ServiceProvider
        {
            get
            {
                return this._package;
            }
        }

        public static void Initialize(Package package)
        {
            Instance = new CreatePrisePluginFileCommand(package);
        }

        private void MenuItemCallback(object sender, EventArgs e) =>
            Execute(ServiceProvider);

        public static void Execute(IServiceProvider serviceProvider)
        {
            var dte = serviceProvider.GetService(typeof(DTE)) as DTE;
            var projectPath = ProjectHelper.GetCurrentProjectPath(dte);
            var options = new PrisePluginFile
            {
                PublishDir = "<path to host application .\\bin\\Debug\\netcoreappx.x\\Plugins>",
                Configuration = "Debug"
            };

            var asJson = JsonConvert.SerializeObject(options);
            File.WriteAllText(Path.Combine(projectPath, "prise.plugin.json"), asJson);
        }
    }
}
