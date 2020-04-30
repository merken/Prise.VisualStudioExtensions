using System;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using EnvDTE;
using Newtonsoft.Json;
using VSLangProj;

namespace Prise.PublishPluginExtension
{
    public class PrisePluginFile
    {
        [JsonProperty("publishDir")]
        public string PublishDir { get; set; }

        [JsonProperty("configuration")]
        public string Configuration { get; set; }

        [JsonProperty("includeProjectNameInPublishDir")]
        public bool IncludeProjectNameInPublishDir { get; set; }
    }

    public static class ProjectHelper
    {
        private static Project GetSelectedProject(DTE dte)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();
            if (dte.ActiveWindow.Type == vsWindowType.vsWindowTypeSolutionExplorer)
            {
                return ((Array)dte.ActiveSolutionProjects).GetValue(0) as Project;
            }

            return null;
        }

        public static string GetCurrentProjectPath(DTE dte)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();
            var project = GetSelectedProject(dte);
            return Path.GetDirectoryName(project.FileName);
        }

        public static string GetCurrentProjectName(DTE dte)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();
            var project = GetSelectedProject(dte);
            return project.Name;
        }

        public static PrisePluginFile GetPrisePluginFileFromSelectedProject(DTE dte)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();

            var project = GetSelectedProject(dte);
            var projectPath = Path.GetDirectoryName(project.FileName);

            if (!Directory.Exists(projectPath)) return null;

            var settingFilePath = Path.Combine(projectPath, "prise.plugin.json");

            if (File.Exists(settingFilePath))
            {
                var json = File.ReadAllText(settingFilePath);
                return JsonConvert.DeserializeObject<PrisePluginFile>(json);
            }

            return null;
        }

        public static bool DoesPrisePluginFileExist(DTE dte) => GetPrisePluginFileFromSelectedProject(dte) != null;

        public static bool ShouldBeVisible(DTE dte)
        {
            Microsoft.VisualStudio.Shell.ThreadHelper.ThrowIfNotOnUIThread();

            var project = GetSelectedProject(dte);
            var hasReference = (project.Object as VSProject)?.References.Find("Prise.Plugin") != null;

            if (hasReference) return hasReference;

            hasReference = XDocument.Load(project.FileName).Root.DescendantNodes().OfType<XElement>()
                .Any(x => x.Name.LocalName.Equals("PackageReference") &&
                          x.Attribute("Include").Value.Equals("Prise.Plugin"));

            return hasReference;
        }
    }
}
