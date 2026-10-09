#!/bin/sh
# Publishes the allowlisted analytics settings to the app as window.__UX_FLOWS_CONFIG__.
# Only variables that are set on the container are included.
set -eu

target="${UX_FLOWS_CONFIG_PATH:-/usr/share/nginx/html/config.js}"

escape() {
  printf '%s' "$1" | tr -d '\r\n' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/</\\u003c/g'
}

entries=""
for name in \
  VITE_ANALYTICS_ENABLED \
  VITE_ANALYTICS_DEBUG \
  VITE_MATOMO_URL \
  VITE_MATOMO_SITE_ID \
  VITE_MATOMO_DIMENSION_FLOW_ID \
  VITE_MATOMO_DIMENSION_VARIANT_ID \
  VITE_MATOMO_DIMENSION_RUN_ID \
  VITE_MATOMO_DIMENSION_SCREEN_ID \
  VITE_MATOMO_DIMENSION_VARIANT_SOURCE
do
  eval "isset=\${$name+x}"
  if [ -n "$isset" ]; then
    eval "value=\${$name}"
    [ -n "$entries" ] && entries="$entries,"
    entries="$entries\"$name\":\"$(escape "$value")\""
  fi
done

printf 'window.__UX_FLOWS_CONFIG__ = {%s}\n' "$entries" > "$target"
