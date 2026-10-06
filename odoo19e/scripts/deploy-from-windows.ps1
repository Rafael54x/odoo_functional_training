# Jalankan di PowerShell Windows (yang punya OpenSSH client).
# Contoh:
#   cd path\to\repo
#   powershell -ExecutionPolicy Bypass -File odoo19e\scripts\deploy-from-windows.ps1
#
# Opsional argumen:
#   .\deploy-from-windows.ps1 -HostName odoodev2 -Src "C:\Users\user\odoo-19.0+e.20250918"

param(
  [string]$HostName = "odoodev2",
  [string]$Src = "C:\Users\user\odoo-19.0+e.20250918",
  [string]$RemoteDir = "odoo19e",
  [string]$RemoteSrc = "odoo-19.0e-src"
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

if (-not (Test-Path $Src)) {
  Write-Error "Source tidak ditemukan: $Src"
}

Write-Host "==> 1) Upload paket odoo19e ke ${HostName}:~/${RemoteDir}"
ssh $HostName "mkdir -p ~/$RemoteDir ~/$RemoteSrc"
scp -r "$Root\*" "${HostName}:~/${RemoteDir}/"

Write-Host "==> 2) Upload Enterprise source (bisa lama)..."
scp -r "$Src\*" "${HostName}:~/${RemoteSrc}/"

Write-Host "==> 3) Fill /opt/odoo/enterprise + start Docker"
ssh $HostName "bash ~/$RemoteDir/scripts/bootstrap-on-odoodev2.sh ~/$RemoteSrc"

Write-Host ""
Write-Host "Selesai. Buka: http://172.16.2.123:8070"
Write-Host "Buat DB odoo_functional (master admin, user admin/admin, tanpa demo)."
