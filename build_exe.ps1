$projectDir = "c:\Users\otoem\Downloads\antigravity\3d_maliyet_hesaplayici"
Set-Location $projectDir

$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $csc)) {
    $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
}

$outputExe = Join-Path $projectDir "3D_Maliyet_Hesaplayici.exe"
$programCs = Join-Path $projectDir "Program.cs"
$iconPath = Join-Path $projectDir "app.ico"

Write-Output "Derleme başlatılıyor: $csc ..."

$argsList = @(
    "/target:winexe",
    "/optimize+",
    "/platform:anycpu",
    "/r:System.dll",
    "/r:System.Core.dll",
    "/r:System.Windows.Forms.dll",
    "/r:System.Drawing.dll",
    "/win32icon:$iconPath",
    "/out:$outputExe",
    $programCs
)

& $csc $argsList

if (Test-Path $outputExe) {
    $size = (Get-Item $outputExe).Length
    Write-Output "BAŞARILI: $outputExe oluşturuldu! Boyut: $size bayt"

    # Kullanıcının Masaüstüne Kısayol Oluştur
    $desktopDir = [Environment]::GetFolderPath([Environment+SpecialFolder]::DesktopDirectory)
    $shortcutPath = Join-Path $desktopDir "3D Baski Maliyet Hesaplayici.lnk"

    $wsh = New-Object -ComObject WScript.Shell
    $shortcut = $wsh.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $outputExe
    $shortcut.WorkingDirectory = $projectDir
    $shortcut.IconLocation = "$outputExe,0"
    $shortcut.Description = "3D Baskı Profesyonel Maliyet ve Teklif Hesaplayıcı (Atölye Sürümü)"
    $shortcut.Save()

    Write-Output "Masaüstü kısayolu oluşturuldu: $shortcutPath"
} else {
    Write-Error "Derleme başarısız oldu!"
}
