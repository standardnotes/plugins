#!/bin/bash

echo 'Building components from' $(pwd)

yarn clean && yarn build:packages

echo "Packaging component assets and zips..."

node scripts/Package.mjs
git add dist
(git commit -m 'chore(release): components') || true