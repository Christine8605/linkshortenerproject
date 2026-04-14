#!/bin/bash

# Read the JSON payload from stdin
payload=$(cat)

# Exit if payload is empty
if [ -z "$payload" ]; then
  exit 0
fi

# Extract toolName from JSON using grep and sed
toolName=$(echo "$payload" | grep -o '"toolName":"[^"]*"' | sed 's/"toolName":"\([^"]*\)"/\1/')

# Only run prettier if toolName is "create" or "edit"
if [ "$toolName" = "create" ] || [ "$toolName" = "edit" ]; then
  npx prettier --write .
fi
