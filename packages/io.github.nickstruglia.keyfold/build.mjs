// Copies the prebuilt files to dist/ after checking each one against SHA256SUMS.
// They are Keyfold's own build for this address; README.md says how to rebuild them.
import { createHash } from 'crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const prebuilt = join(here, 'prebuilt')
const dist = join(here, 'dist')

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [relative(prebuilt, path).split('\\').join('/')]
  })

const sums = new Map(
  readFileSync(join(here, 'SHA256SUMS'), 'utf8')
    .trim()
    .split('\n')
    .map((line) => {
      const [hash, file] = line.split('  ')
      return [file, hash]
    }),
)
const files = walk(prebuilt).sort()
if (files.join('\n') !== [...sums.keys()].sort().join('\n')) throw new Error('prebuilt/ does not match SHA256SUMS')

rmSync(dist, { recursive: true, force: true })
for (const file of files) {
  const hash = createHash('sha256').update(readFileSync(join(prebuilt, file))).digest('hex')
  if (hash !== sums.get(file)) throw new Error(`${file} does not match SHA256SUMS`)
  mkdirSync(dirname(join(dist, file)), { recursive: true })
  copyFileSync(join(prebuilt, file), join(dist, file))
}
console.log(`Keyfold: ${files.length} files checked and copied to dist/`)
