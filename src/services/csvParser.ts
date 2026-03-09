/**
 * CSV parsing functions for OFX conversion
 */

export function parseCsvSemiColon(content: string): string[][] {
  /*
   * Date
   * Description
   * Installments
   * Real Currency Value
   * Dolar Currency Value
   * Credit card last digits
   * Issuer name
   */

  return content
    .split("Adicional ; Nome;\n")[1]
    .split("\n")
    .map((transaction) => {
      return transaction
        .replaceAll('"', "")
        .replaceAll(";  ;", ";;")
        .split(";");
    })
    .filter((transaction) => transaction.length > 4);
}
