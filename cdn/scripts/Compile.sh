#!/bin/bash

echo "Packaging packages assets and zips..."

yarn run package
git add dist
git add ../README.md
(git commit -m 'chore(release): packages') || true