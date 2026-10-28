$projectDir = "c:\Users\otoem\Downloads\antigravity\3d_maliyet_hesaplayici"
$zipFile = Join-Path $projectDir "payload.zip"

if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

$tempDir = Join-Path $env:TEMP ("payload_build_" + [Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Output "Dosyalar geçici klasöre toplanıyor: $tempDir"

$filesToInclude = @(
    "3D_Maliyet_Hesaplayici.exe",
    "index.html",
    "app.js",
    "styles.css",
    "app.ico",
    "baslat.bat",
    "ornek_test_baski.gcode",
    "ornek_test_parcasi.stl",
    "test_bambu_model.3mf"
)

foreach ($f in $filesToInclude) {
    $src = Join-Path $projectDir $f
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $tempDir $f) -Force
    }
}

# lib klasörünü kopyala
$libSrc = Join-Path $projectDir "lib"
if (Test-Path $libSrc) {
    Copy-Item -Path $libSrc -Destination (Join-Path $tempDir "lib") -Recurse -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipFile)

Remove-Item -Path $tempDir -Recurse -Force

$zipSize = (Get-Item $zipFile).Length
Write-Output "BAŞARILI: payload.zip oluşturuldu! Boyut: $zipSize bayt (~$([Math]::Round($zipSize/1MB, 2)) MB)"
