/**
 * OFX building functions for OFX conversion
 */

import { formatDate, getCurrentDate } from "./dateUtils";
import { parseCurrencyValue } from "./currencyUtils";

export function generateTransactionId(
  date: string,
  value: string,
  description: string,
): string {
  const keyFromDescription = description?.match(/([0-z])\w+/g)?.join("");
  return `${date}-${value.replaceAll(".", "")}-${keyFromDescription?.toLowerCase()}`;
}

export function buildOfxTransaction(transaction: readonly string[]): string {
  const [date, description, installments, value] = transaction;

  if (!date || !value || !description) return "";

  const parsedValue = parseCurrencyValue(value);
  const descriptionWithInstallments = `${description} ${installments.replaceAll(" ", "")}`;

  return `
<STMTTRN>
<TRNTYPE>${parsedValue.includes("-") ? "DEBIT" : "CREDIT"}
<DTPOSTED>${formatDate(date)}[-3:GMT]
<TRNAMT>${parsedValue}
<FITID>${generateTransactionId(formatDate(date), parsedValue, descriptionWithInstallments)}
<MEMO>${descriptionWithInstallments}
</STMTTRN>`;
}

export function buildOfxHeader(startDate: string, endDate: string): string {
  return `
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>

<DTSERVER>${getCurrentDate()}[-3:GMT]
<LANGUAGE>POR
</SONRS>
</SIGNONMSGSRSV1>

<CREDITCARDMSGSRSV1>
<CCSTMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>

<CCSTMTRS>
<CURDEF>BRL
<CCACCTFROM>
<ACCTID>79f6b28a-ffda-117e-a547-1e83255ad8f4
</CCACCTFROM>

<BANKTRANLIST>
<DTSTART>${formatDate(startDate)}[-3:GMT]
<DTEND>${formatDate(endDate)}[-3:GMT]`;
}

export function buildOfxRawData(
  parsedCsvContent: readonly (readonly string[])[],
  startDate: string,
  endDate: string,
): string {
  return parsedCsvContent.reduce(
    (acc, transaction) => {
      return `${acc}\n${buildOfxTransaction(transaction)}`;
    },
    buildOfxHeader(startDate, endDate),
  );
}

export function buildFileName(startDate: string, endDate: string): string {
  return `transactions_${startDate.replaceAll("/", "-")}_to_${endDate.replaceAll("/", "-")}.ofx`;
}

export function buildOfxFileData(data: string): string {
  const fixedData = data.replaceAll("\n", "\r\n").replaceAll("#", "_");
  return encodeURI(`data:text/ofx;charset=utf-8,${fixedData}`);
}
