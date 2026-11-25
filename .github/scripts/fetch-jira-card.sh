#!/usr/bin/env bash
# Writes the Jira card of a branch to a Markdown file, for the Claude reviewer.
# Needs JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN (see docs/setup-guide.md).
# It never fails: if the card cannot be read, the file says why.
set -u

BRANCH="$1"
OUTPUT_FILE="$2"

# feature/FUR-30 or feature/FUR-30-api -> FUR-30 (the card of the branch)
CARD_KEY=$(echo "$BRANCH" | grep -oE 'FUR-[0-9]+' | head -n 1 || true)

if [ -z "$CARD_KEY" ]; then
  echo "La rama \`$BRANCH\` no lleva el número de una tarjeta (FUR-n): no se ha podido leer Jira." > "$OUTPUT_FILE"
  exit 0
fi

if [ -z "${JIRA_BASE_URL:-}" ] || [ -z "${JIRA_EMAIL:-}" ] || [ -z "${JIRA_API_TOKEN:-}" ]; then
  echo "No se ha podido leer la tarjeta $CARD_KEY: falta configurar JIRA_BASE_URL, JIRA_EMAIL o JIRA_API_TOKEN en el repo." > "$OUTPUT_FILE"
  exit 0
fi

CARD_JSON=$(mktemp)
if ! curl --silent --fail --user "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/2/issue/$CARD_KEY?fields=summary,description,status,subtasks" \
  --output "$CARD_JSON"; then
  echo "No se ha podido leer la tarjeta $CARD_KEY de Jira (¿token caducado o tarjeta que no existe?)." > "$OUTPUT_FILE"
  exit 0
fi

# API v2: the description comes as plain text (Jira wiki markup), easy to read
jq -r '
  "# \(.key) - \(.fields.summary)\n\n" +
  "Estado en Jira: \(.fields.status.name)\n\n" +
  "## Subtareas (son parte de esta misma tarjeta)\n\n" +
  ([.fields.subtasks[]? | "- \(.key): \(.fields.summary)"] | if length == 0 then "Ninguna" else join("\n") end) +
  "\n\n## Descripción (historia, reglas y escenarios)\n\n" +
  (.fields.description // "(sin descripción)")
' "$CARD_JSON" > "$OUTPUT_FILE"
