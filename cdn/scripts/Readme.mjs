import path from 'path'
import { fileURLToPath } from 'url'
import { readJson, readFile, writeFile } from '../../scripts/ScriptUtils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '../..')

export function writePackageDirectoryToReadme() {
  const packageEntries = readJson(path.join(ROOT, 'cdn/dist/packages.json'))
  const packages = Object.values(packageEntries)

  const template = readFile(path.join(ROOT, 'readme.template.md'))

  const DirectoryPlaceholder = '<!-- DIRECTORY -->'

  let directoryString = ''

  for (const packageEntry of packages) {
    let string = '- '
    string += `**Name:** ${packageEntry.name}`
    string += '\n  '
    string += `**By:** ${packageEntry.publisher}`
    string += '\n  '
    string += `**Install URL:** ${packageEntry.latest_url}`
    string += '\n'

    directoryString += string
  }

  const result = template.replace(DirectoryPlaceholder, directoryString)

  writeFile(result, path.join(ROOT, 'README.md'))

  console.log('Wrote README file', result)
}
