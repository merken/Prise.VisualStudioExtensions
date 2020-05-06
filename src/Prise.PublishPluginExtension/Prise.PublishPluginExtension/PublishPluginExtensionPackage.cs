using System;
using System.ComponentModel.Design;
using System.Runtime.InteropServices;
using System.Threading;
using EnvDTE;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Task = System.Threading.Tasks.Task;

namespace Prise.PublishPluginExtension
{
    /// <summary>
    /// This is the class that implements the package exposed by this assembly.
    /// </summary>
    /// <remarks>
    /// <para>
    /// The minimum requirement for a class to be considered a valid package for Visual Studio
    /// is to implement the IVsPackage interface and register itself with the shell.
    /// This package uses the helper classes defined inside the Managed Package Framework (MPF)
    /// to do it: it derives from the Package class that provides the implementation of the
    /// IVsPackage interface and uses the registration attributes defined in the framework to
    /// register itself and its components with the shell. These attributes tell the pkgdef creation
    /// utility what data to put into .pkgdef file.
    /// </para>
    /// <para>
    /// To get loaded into VS, the package must be referred by &lt;Asset Type="Microsoft.VisualStudio.VsPackage" ...&gt; in .vsixmanifest file.
    /// </para>
    /// </remarks>
    [PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
    [InstalledProductRegistration("#110", "#112", "1.0", IconResourceID = 400)]
    [ProvideMenuResource("Menus.ctmenu", 1)]
    [Guid(Constants.PackageGuidString)]
    [ProvideAutoLoad(UIContextGuids80.SolutionExists, PackageAutoLoadFlags.BackgroundLoad)]
    public sealed class PublishPluginExtensionPackage : AsyncPackage
    {
        #region Package Members

        /// <summary>
        /// Initialization of the package; this method is called right after the package is sited, so this is the place
        /// where you can put all the initialization code that rely on services provided by VisualStudio.
        /// </summary>
        /// <param name="cancellationToken">A cancellation token to monitor for initialization cancellation, which can occur when VS is shutting down.</param>
        /// <param name="progress">A provider for progress updates.</param>
        /// <returns>A task representing the async work of package initialization, or an already completed task if there is none. Do not return null from this method.</returns>
        protected override async Task InitializeAsync(CancellationToken cancellationToken, IProgress<ServiceProgressData> progress)
        {
            var mcs = await GetServiceAsync(typeof(IMenuCommandService)) as OleMenuCommandService;
            var menuCommandId = new CommandID(Constants.PublishPluginCommandSet, 0x1010);
            var menuItem = new OleMenuCommand(null, menuCommandId);
            menuItem.BeforeQueryStatus += MenuItem_BeforeQueryStatus;

            await base.InitializeAsync(cancellationToken, progress);

            // When initialized asynchronously, the current thread may be a background thread at this point.
            // Do any initialization that requires the UI thread after switching to the UI thread.
            await this.JoinableTaskFactory.SwitchToMainThreadAsync(cancellationToken);

            //KnownImageIds.Package
            mcs.AddCommand(menuItem);

            Prise.PublishPluginExtension.CreatePrisePluginFileCommand.Initialize(this);
            Prise.PublishPluginExtension.CreateNuspecFileCommand.Initialize(this);
            Prise.PublishPluginExtension.PublishPluginCommand.Initialize(this);
            Prise.PublishPluginExtension.PublishPluginAsNugetCommand.Initialize(this);
        }
        #endregion

        private void MenuItem_BeforeQueryStatus(object sender, EventArgs e) =>
            ((OleMenuCommand)sender).Visible = ProjectHelper.ShouldBeVisible(GetService(typeof(DTE)) as DTE);
    }
}
