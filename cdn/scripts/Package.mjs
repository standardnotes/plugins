import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { spawnSync as spawn } from 'child_process'

import zip from '@standardnotes/deterministic-zip'
import minimatch from 'minimatch'

import { Packages } from '../dist/src/Packages.js'
import { ensureDirExists, doesDirExist, emptyExistingDir } from '../../scripts/ScriptUtils.mjs'

import { writePackageDirectoryToReadme } from './Readme.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('Beginning packaging procedure...')

const SourceFilesPath = path.join(__dirname, '../../packages')

const DistDir = path.join(__dirname, '../dist')
const ZipsDir = path.join(DistDir, '/zips')
const AssetsDir = path.join(DistDir, '/static')
const EntriesDir = path.join(DistDir, '/entries')

const TmpDir = path.join(DistDir, 'tmp')
const PackagesJsonPath = path.join(DistDir, 'packages.json')

const CdnInfoJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../cdn.json')).toString())
const PackagesJson = JSON.parse(fs.readFileSync(PackagesJsonPath).toString())
console.log('Loaded existing checksums from', PackagesJsonPath)

async function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve) => {
    zip(sourceDir, outPath, { cwd: sourceDir }, (err) => {
      console.log(`Zipped to ${outPath}`)
      resolve(outPath)
    })
  })
}

const copyFileOrDir = (src, dest, exludedFilesGlob) => {
  const isDir = fs.lstatSync(src).isDirectory()
  if (isDir) {
    ensureDirExists(dest)
    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)

      const excluded = exludedFilesGlob && minimatch(srcPath, exludedFilesGlob)
      if (excluded) {
        console.log('Excluding file', srcPath)
        continue
      }
      const destPath = path.join(dest, entry.name)

      entry.isDirectory() ? copyFileOrDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath)
    }
  } else {
    const excluded = exludedFilesGlob && minimatch(src, exludedFilesGlob)
    if (excluded) {
      console.log('Excluding file', src)
      return
    }
    fs.copyFileSync(src, dest)
  }
}

const getComponentSrcPath = (feature) => {
  return path.join(SourceFilesPath, feature.identifier)
}

const copyComponentAssets = async (feature, destination, exludedFilesGlob) => {
  const srcComponentPath = getComponentSrcPath(feature)

  if (!doesDirExist(srcComponentPath)) {
    return false
  }

  emptyExistingDir(destination)
  ensureDirExists(destination)

  for (const file of feature.staticFiles) {
    const srcFilePath = path.join(srcComponentPath, file)
    if (!fs.existsSync(srcFilePath)) {
      continue
    }

    const targetFilePath = path.join(destination, file)
    copyFileOrDir(srcFilePath, targetFilePath, exludedFilesGlob)
  }

  return true
}

const computePackageZipChecksum = async (zipPath) => {
  const zipData = fs.readFileSync(zipPath, 'base64')
  const base64Hash = crypto.createHash('sha256').update(zipData).digest('hex')
  const checksumProcess = spawn('sha256sum', [zipPath])
  const checksumString = checksumProcess.stdout.toString()
  const binaryHash = checksumString.split('  ')[0]

  return {
    base64Hash: base64Hash,
    binaryHash: binaryHash,
  }
}

const packageFeature = async ({ feature, noZip }) => {
  console.log('Processing feature', feature.identifier, '...')

  const assetsLocation = `${path.join(AssetsDir, feature.identifier)}`
  const assetsSuccess = await copyComponentAssets(feature, assetsLocation, '**/package.json')
  if (!assetsSuccess) {
    console.log('Failed to copy assets for', feature.identifier)
    return
  }

  if (noZip) {
    console.log('Input arg noZip detected; not zipping asset.')
    return
  }

  const zipAssetsTmpLocation = `${path.join(TmpDir, feature.identifier)}`
  const zipAssetsSuccess = await copyComponentAssets(feature, zipAssetsTmpLocation)
  if (!zipAssetsSuccess) {
    console.log('Failed to copy zip assets for', feature.identifier)
    return
  }

  const zipDestination = `${ZipsDir}/${feature.identifier}.zip`
  await zipDirectory(zipAssetsTmpLocation, zipDestination)

  const packageJsonFilePath = path.join(getComponentSrcPath(feature), 'package.json')
  const packageJsonFile = JSON.parse(fs.readFileSync(packageJsonFilePath).toString())

  const checksum = await computePackageZipChecksum(zipDestination, packageJsonFile.version)

  const packageEntry = {
    ...packageJsonFile.sn,
    identifier: feature.identifier,
    version: packageJsonFile.version,
    url: `${CdnInfoJson.host}/static/${feature.identifier}/${packageJsonFile.sn.main}`,
    download_url: `${CdnInfoJson.host}/zips/${feature.identifier}.zip`,
    latest_url: `${CdnInfoJson.host}/entries/${feature.identifier}.json`,
    publisher: packageJsonFile.author,
    ...checksum,
  }

  PackagesJson[feature.identifier] = packageEntry

  fs.writeFileSync(`${EntriesDir}/${feature.identifier}.json`, JSON.stringify(packageEntry, undefined, 2))

  console.log(`Computed checksums for ${feature.identifier}:`, checksum)
}

await (async () => {
  const args = process.argv[2] || ''
  const noZip = args.includes('--no-zip')

  let index = 0
  for (const feature of Packages) {
    if (index === 0) {
      console.log('\n---\n')
    }

    await packageFeature({ feature, noZip })

    if (index !== Packages.length - 1) {
      console.log('\n---\n')
    }

    index++
  }

  fs.writeFileSync(PackagesJsonPath, JSON.stringify(PackagesJson, undefined, 2))
  copyFileOrDir(PackagesJsonPath, PackagesJsonPath)

  console.log('Succesfully wrote checksums to', PackagesJsonPath)

  emptyExistingDir(TmpDir)

  writePackageDirectoryToReadme()
})()
