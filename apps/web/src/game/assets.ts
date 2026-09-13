export function assetUrl(fileName: string): string {
  return import.meta.env.DEV ? `/image/${fileName}` : `/assets/image/${fileName}`;
}
