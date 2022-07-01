#!/bin/bash

echo 'Building packages from' $(pwd)

yarn clean && yarn build:packages

echo "Packaging packages assets and zips..."

node cdn/scripts/Package.mjs
git add dist
git add ../README.md
(git commit -m 'chore(release): packages') || true