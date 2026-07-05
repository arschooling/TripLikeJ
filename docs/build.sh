#!/bin/bash
set -e
cd "$(dirname "$0")"

BABEL=/tmp/build-tools/node_modules/.bin/babel
TERSER=/tmp/build-tools/node_modules/.bin/terser
PRESET=/tmp/build-tools/node_modules/@babel/preset-react

# sw.js 버전 자동 증가 (500 초과 시 1로 리셋)
CURRENT=$(grep -o "tlj-v[0-9]*" sw.js | grep -o "[0-9]*")
NEXT=$((CURRENT + 1))
if [ $NEXT -gt 500 ]; then NEXT=1; fi
sed -i '' -e "s/tlj-v${CURRENT}/tlj-v${NEXT}/" sw.js
sed -i '' -e "s/EXPECTED_CACHE = 'tlj-v${CURRENT}'/EXPECTED_CACHE = 'tlj-v${NEXT}'/" index.html
echo "▸ SW 버전: tlj-v${CURRENT} → tlj-v${NEXT}"

# UI 뱃지 버전 동기화 (app.jsx의 "v숫자" 표시)
UI_CURRENT=$(grep -o '>v[0-9]*<' app.jsx | grep -o "[0-9]*" | head -1)
if [ -n "$UI_CURRENT" ]; then
  sed -i '' -e "s/>v${UI_CURRENT}</>v${NEXT}</" app.jsx
  echo "▸ UI 버전: v${UI_CURRENT} → v${NEXT}"
fi

# 빌드
$BABEL app.jsx --presets $PRESET -o app.js
cat data.js app.js > bundle.js
$TERSER bundle.js -o bundle.min.js --compress --mangle
echo "▸ 빌드 완료 (bundle.min.js)"
