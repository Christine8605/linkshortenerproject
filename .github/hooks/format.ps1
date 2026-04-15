$payload = [Console]::In.ReadToEnd()

if ([string]::IsNullOrWhiteSpace($payload)) {
  exit 0
}

try {
  $hookData = $payload | ConvertFrom-Json
} catch {
  exit 0
}

if ($hookData.toolName -in @("create", "edit")) {
  npx prettier --write .
}
