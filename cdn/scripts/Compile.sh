#!/bin/bash

echo 'Building packages from' $(pwd)

yarn build

echo "Packaging packages assets and zips..."

yarn run package
git add dist
git add ../README.md
(git commit -m 'chore(release): packages') || true