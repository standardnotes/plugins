import { PackageDefinition } from './Package'

const BasePackageStaticFiles = ['index.html', 'dist', 'build', 'package.json']

const Packages: PackageDefinition[] = [
  {
    identifier: 'com.sncommunity.minimal-markdown',
    staticFiles: [...BasePackageStaticFiles],
  },
]

export { Packages }
