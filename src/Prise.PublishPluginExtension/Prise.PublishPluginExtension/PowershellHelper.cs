namespace Prise.PublishPluginExtension
{
    internal class PowershellHelper
    {
        /// <summary>
        /// This issue arose in the latest dotnet CLI, the produced DLL files from the dotnet publish command may have files that have no LastWriteTime (Date Modified) set.
        /// As a result, this defaults to 1/1/1980. Which does not handle well with dotnet pack
        /// https://github.com/NuGet/Home/issues/7001
        /// The fix is to add 20yrs to the original timestamp, making it 1/1/2000, which is a valid date
        /// </summary>
        /// <param name="workingDir"></param>
        /// <param name="configuration"></param>
        /// <param name="targetFramework"></param>
        /// <returns></returns>
        internal static ProcessOutput FixUpdateLastWriteTime(string workingDir, string configuration, string targetFramework)
        {
            var arguments = $@"gci -path "".\bin\{configuration}\{targetFramework}\publish"" -rec -file *.dll | Where - Object {{$_.LastWriteTime - lt(Get - Date).AddYears(-20) }} | %  {{ try {{ $_.LastWriteTime = '01/01/2000 00:00:00' }} catch {{}} }}";
            return Execute(workingDir, arguments);
        }

        private static ProcessOutput Execute(string workingDir, string arguments) => new ProcessHelper(
                "powershell.exe",
                workingDir,
                arguments
            ).Run();
    }
}
