# Standard Notes Community Packages

**Note**: this is an experimental repository.

## Installation

In Standard Notes desktop or web, open Preferences > General > Advanced Options > Install External Package, and copy and paste an install link from the directory below.

## Adding a new plugin

1. Add plugin to `packages` directory with valid `yarn build` command that generates either a `dist` or `build` directory with your compiled plugin files.
2. Add entry to `cdn/src/Packages.ts.`
3. Submit pull request.

## Directory

| Name | Publisher | Install Link |
|------|-----------|--------------|
|Minimal Markdown|Standard Notes Retired|https://standardnotes.github.io/plugins/cdn/dist/entries/com.sncommunity.minimal-markdown.json|
|Bold Editor|Standard Notes Retired|https://standardnotes.github.io/plugins/cdn/dist/entries/com.sncommunity.bold-editor.json|
|Advanced Checklist|Standard Notes Retired|https://standardnotes.github.io/plugins/cdn/dist/entries/com.sncommunity.advanced-checklist.json|