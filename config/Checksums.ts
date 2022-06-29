type PackageIdentifier = string

type ChecksumEntry = {
  version: string
  base64: string
  binary: string
}

export type ComponentChecksumsType = Record<PackageIdentifier, ChecksumEntry>
