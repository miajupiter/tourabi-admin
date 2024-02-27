// 'USD', 'EUR', 'AZN', 'RUB', 'TRY', 'GBP'
export enum CurrencyType {
  USD = 'US$',
  EUR = '€',
  AZN = 'AZN',
  RUB = '₽',
  TRY = 'TL',
  GBP = '£',
}

export type CurrencyCode = keyof typeof CurrencyType
// const values = Object.keys(NumericEnum).filter((v) => !isNaN(Number(v)));
// console.log(values); // 👉️ ['0', '1', '2']

// const names = Object.keys(NumericEnum).filter((v) => isNaN(Number(v)));
// console.log(names); // 👉️ ['Small', 'Medium', 'Large']

export const CurrencyTypeList = Object.keys(CurrencyType)