export type NumericKey<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type StringKey<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];