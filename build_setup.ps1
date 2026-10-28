$projectDir = "c:\Users\otoem\Downloads\antigravity\3d_maliyet_hesaplayici"
Set-Location $projectDir

$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $csc)) {
    $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
}

$outputExe = Join-Path $projectDir "Setup_3D_Maliyet_Hesaplayici.exe"
$setupProgramCs = Join-Path $projectDir "SetupProgram.cs"
$iconPath = Join-Path $projectDir "app.ico"
$payloadZip = Join-Path $projectDir "payload.zip"

if (-not (Test-Path $payloadZip)) {
    Write-Error "payload.zip bulunamadı! Önce create_payload.ps1 çalıştırılmalıdır."
    exit 1
}

Write-Output "Setup derlemesi başlatılıyor: $csc ..."

$argsList = @(
    "/target:winexe",
    "/optimize+",
    "/platform:anycpu",
    "/r:System.dll",
    "/r:System.Core.dll",
    "/r:System.Windows.Forms.dll",
    "/r:System.Drawing.dll",
    "/r:System.IO.Compression.dll",
    "/r:System.IO.Compression.FileSystem.dll",
    "/win32icon:$iconPath",
    "/resource:$payloadZip,payload.zip",
    "/out:$outputExe",
    $setupProgramCs
)

& $csc $argsList

if (Test-Path $outputExe) {
    $size = (Get-Item $outputExe).Length
    $sizeKb = [Math]::Round($size / 1024, 1)
    Write-Output "BAŞARILI: $outputExe oluşturuldu! Boyut: $size bayt (~$sizeKb KB)"
} else {
    Write-Error "Setup derleme başarısız oldu!"
}
