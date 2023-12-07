# Standard Notes Community Plugins

**Note**: This is an experimental repository.

## Installing a plugin

In Standard Notes desktop or web:

1. Open Preferences > General > Advanced Options
2. Scroll down to "Install External Package"
3. Copy and paste an install link from the directory below.

## Submitting your plugin to the directory

1. Add plugin to `packages` directory with valid `yarn build` command that generates either a `dist` or `build` directory with your compiled plugin files.
2. Add entry to `cdn/plugins.json`, ensuring the identifier matches the folder name of your plugin in `packages`.
3. Submit pull request.

## Directory

<!-- DIRECTORY -->
