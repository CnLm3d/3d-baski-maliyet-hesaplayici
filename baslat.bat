@echo off
title 3D Baski Maliyet ve Teklif Hesaplayici
chcp 65001 >nul
cls

echo ========================================================
echo   3D BASKI MALIYET VE TEKLIF HESAPLAYICI (ATOLYE SURUMU)
echo   Filenta PLA ^& Elegoo Saturn 4 16K SLA Destekli
echo ========================================================
echo.
echo Masaustu uygulamasi baslatiliyor...
echo.

if exist "%~dp03D_Maliyet_Hesaplayici.exe" (
    start "" "%~dp03D_Maliyet_Hesaplayici.exe"
) else (
    start "" "%~dp0index.html"
)

exit
