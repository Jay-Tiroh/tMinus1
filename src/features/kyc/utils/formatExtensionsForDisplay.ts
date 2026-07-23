export const formatExtensionsForDisplay = (extensions: string[]): string => {
  return Array.from(
    new Set(extensions.map((ext) => ext.replace(/^\./, "").toUpperCase())),
  ).join(" · ");
};
