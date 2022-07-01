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

  let directoryString = ``
  directoryString += '| Name | Publisher | Install Link |'
  directoryString += '\n'
  directoryString += '|------|-----------|--------------|'

  for (const packageEntry of packages) {
    let string = '|'
    string += `${packageEntry.name}`
    string += '|'
    string += `${packageEntry.publisher}`
    string += '|'
    string += `${packageEntry.latest_url}`
    string += '|'
    directoryString += '\n'

    directoryString += string
  }

  const result = template.replace(DirectoryPlaceholder, directoryString)

  writeFile(result, path.join(ROOT, 'README.md'))

  console.log('Wrote README file', result)
}
