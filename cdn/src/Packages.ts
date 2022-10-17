import { PackageDefinition } from './Package'

const BasePackageStaticFiles = ['index.html', 'dist', 'build', 'package.json']

const Packages: PackageDefinition[] = [
  {
    identifier: 'com.sncommunity.minimal-markdown',
    staticFiles: [...BasePackageStaticFiles],
  },
  {
    identifier: 'com.sncommunity.bold-editor',
    staticFiles: [...BasePackageStaticFiles],
  },
  {
    identifier: 'com.sncommunity.advanced-checklist',
    staticFiles: [...BasePackageStaticFiles],
  },
  {
    identifier: 'com.sncommunity.markdown-basic',
    staticFiles: [...BasePackageStaticFiles],
  },
  {
    identifier: 'com.sncommunity.markdown-math',
    staticFiles: [...BasePackageStaticFiles],
  },
]

export { Packages }
