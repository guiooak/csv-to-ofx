export type Transaction = [date: string, description: string, installments: string, value: string, dolarValue?: string, card?: string, issuerName?: string];

export interface DateInterval {
  startDate: string;
  endDate: string;
}

export interface OfxFileData {
  content: string;
  fileName: string;
}
