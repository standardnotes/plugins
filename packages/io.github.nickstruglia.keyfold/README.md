# Keyfold

A key manager for Standard Notes: crypto seed phrases and wallet keys, plus SSH and PGP keys, API tokens and recovery
codes. Each entry folds into a one-line card, secrets stay hidden until revealed, saved entries open locked against
accidental changes, seed phrases and keys are checked for typos (BIP39, Electrum, Monero and aezeed checksums,
Base58Check, Bech32, PGP armor), and an optional vault password encrypts the whole note again (AES-256-GCM,
PBKDF2-SHA256 with 600,000 iterations). Encrypted backup files open in a single-file offline viewer, without Standard
Notes, and restore into an empty Keyfold note.

Its Content Security Policy blocks every outgoing connection (`connect-src 'none'`), and scripts, images and fonts
from other sites. The only runtime dependency is Preact.

- Source, tests and documentation: https://github.com/nickstruglia/standard-notes-keyfold (MIT)
- This copy: version 1.0.31, built from commit [`77e7bd8`](https://github.com/nickstruglia/standard-notes-keyfold/commit/77e7bd8bac96194cc162e63c118a7ac24687e712)

## Why the files are prebuilt

This repository builds its packages on Node 16, and Keyfold's build (Vite 8) needs Node 20.19 or newer. So
`prebuilt/` holds the output of Keyfold's own build for this package's address, and `yarn build` checks every file
against `SHA256SUMS` before copying it to `dist/`.

## Rebuilding and comparing

With Node 22.12 or newer:

```sh
git clone https://github.com/nickstruglia/standard-notes-keyfold.git
cd standard-notes-keyfold
git checkout 77e7bd8bac96194cc162e63c118a7ac24687e712
npm ci --ignore-scripts
node scripts/directory-package.mjs 1.0.31
diff -r directory-package/io.github.nickstruglia.keyfold/prebuilt <this folder>/prebuilt
diff directory-package/io.github.nickstruglia.keyfold/SHA256SUMS <this folder>/SHA256SUMS
```

The script builds Keyfold for `https://standardnotes.github.io/plugins/cdn/dist/static/io.github.nickstruglia.keyfold/dist/` and writes this folder, with the same files byte for byte.
