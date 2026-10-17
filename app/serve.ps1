$root = (Resolve-Path $PSScriptRoot).Path.TrimEnd("\") + "\"
$port = 5173
$prefix = "http://localhost:$port/"

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".json" = "application/json"
  ".ico"  = "image/x-icon"
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Tindahan ni Aling Rosa -> $prefix"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }

  $full = [System.IO.Path]::GetFullPath((Join-Path $root $path))
  if (-not $full.StartsWith($root) -or -not (Test-Path -LiteralPath $full -PathType Leaf)) {
    $context.Response.StatusCode = 404
    $bytes = [Text.Encoding]::UTF8.GetBytes("Hindi nahanap.")
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
    continue
  }

  $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
  $context.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
  $bytes = [System.IO.File]::ReadAllBytes($full)
  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}
