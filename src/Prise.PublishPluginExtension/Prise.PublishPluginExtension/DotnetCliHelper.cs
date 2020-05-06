using System;

namespace Prise.PublishPluginExtension
{
    internal static class DotnetCliHelper
    {
        internal static ProcessOutput Publish(string workingDir, string configuration, string projectFile, string outputPath = null)
        {
            var outputArgument = !String.IsNullOrEmpty(outputPath) ? $"--output {outputPath}" : String.Empty;
            var arguments = $@"/c ""dotnet publish --configuration {configuration} {outputArgument} {projectFile}""";
            return Execute(workingDir, arguments);
        }

        internal static ProcessOutput Pack(string workingDir, string configuration, string projectFile, string outputPath, string nuspecFile)
        {
            var arguments = $@"/c ""dotnet pack --configuration {configuration} /p:nuspecfile={nuspecFile} --output {outputPath} {projectFile}""";
            return Execute(workingDir, arguments);
        }

        private static ProcessOutput Execute(string workingDir, string arguments) => new ProcessHelper(
                "cmd.exe",
                workingDir,
               arguments
            ).Run();
    }
}
