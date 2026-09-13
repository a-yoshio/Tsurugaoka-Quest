const assetBaseUrl = import.meta.env.VITE_ASSETS_S3_BASE_URL?.replace(/\/+$/, "");

export function assetUrl(fileName: string): string {
  return assetBaseUrl
    ? `${assetBaseUrl}/assets/image/${fileName}`
    : `/${fileName}`;
}
