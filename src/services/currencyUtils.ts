/**
 * Currency utility functions for OFX conversion
 */

export function parseCurrencyValue(v: string): string {
  if (!v) return "";

  const parsedValue = v
    .replaceAll(" ", "")
    .replace("R$", "")
    .replace(".", "")
    .replace(",", ".");

  return parsedValue.includes("-")
    ? parsedValue.replace("-", "")
    : `-${parsedValue}`;
}
