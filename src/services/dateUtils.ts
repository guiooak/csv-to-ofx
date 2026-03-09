/**
 * Date utility functions for OFX conversion
 */

export function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDate(d: string): string {
  const [day, month, year] = d.split("/");
  return `${year}${month}${day}000000`;
}

export function getCurrentDate(): string {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}000000`;
}

export function isValidDate(string: string): boolean {
  return (string.match(/\//g) || []).length === 2;
}

export function getDateInterval(dates: string[]): {
  startDate: string;
  endDate: string;
} {
  const validDates = dates.reduce<{ date: string; unix: number }[]>(
    (acc, date) => {
      if (!isValidDate(date)) {
        return acc;
      }

      const [day, month, year] = date.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      return [
        ...acc,
        {
          date: date,
          unix: new Date(formattedDate).getTime(),
        },
      ];
    },
    [],
  );

  validDates.sort((a, b) => a.unix - b.unix);

  const lastIndex = validDates.length - 1;

  return {
    startDate: validDates[0].date,
    endDate: validDates[lastIndex].date,
  };
}

export function forwardDateBasedOnInstallments(
  date: string,
  installments: string,
): string {
  const installment = +installments
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .split("/")[0];

  const [day, month, year] = date
    .replaceAll(" ", "")
    .split("/")
    .map((v) => +v);

  const monthAndInstallment = month + installment - 1;
  const newMonth =
    monthAndInstallment > 12 ? monthAndInstallment % 12 : monthAndInstallment;
  const newYear =
    monthAndInstallment > 12
      ? year + Math.floor(monthAndInstallment / 12)
      : year;

  return `${pad(day)}/${pad(newMonth)}/${newYear}`;
}

export function fixInstallmentDates(data: string[][]): void {
  data.forEach((transaction) => {
    const [date, , installments] = transaction;

    if (date.includes("/") && installments.includes("/")) {
      transaction[0] = forwardDateBasedOnInstallments(date, installments);
    }
  });
}
