import { FeatureDescription } from "@standardnotes/features"

type PackageIdentifier = string

export type PackageDefinition = {
  identifier: PackageIdentifier
  staticFiles: string[]
}

export type PackageCdnEntry = FeatureDescription & {
  base64Hash: string
  binaryHash: string
}

export type PackageCdnList = Record<PackageIdentifier, PackageCdnEntry>
