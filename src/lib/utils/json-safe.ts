export function jsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, currentValue) => {
      if (typeof currentValue !== "bigint") {
        return currentValue;
      }

      const asNumber = Number(currentValue);
      return Number.isSafeInteger(asNumber) ? asNumber : currentValue.toString();
    })
  ) as T;
}
