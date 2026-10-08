#!/usr/bin/env bash
# Compila todo y deja una carpeta estática desplegable en host/dist
set -e
for p in credit insurance; do
  (cd $p && npm install --no-audit --no-fund && npm run build && npm run build:widget)   # build federado + build widget autónomo
done
(cd host && npm install --no-audit --no-fund && npm run build)
mkdir -p host/dist/remotes host/dist/widgets
cp -r credit/dist host/dist/remotes/credit          # remotes federados (los carga el shell)
cp -r insurance/dist host/dist/remotes/insurance
cp credit/dist-widget/credit-widget.js host/dist/widgets/             # widgets autónomos (los usa widget-demo.html)
cp insurance/dist-widget/insurance-widget.js host/dist/widgets/
echo "LISTO -> host/dist  (npm start para verlo en http://localhost:5000)"
