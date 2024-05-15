export function isString(val: unknown): val is string {
  return typeof val === "string";
}
export function stringEquals(s1?: string | null, s2?: string | null) {
  return (
    s1 === s2 ||
    (!!s1 &&
      !!s2 &&
      s1.localeCompare(s2, undefined, { sensitivity: "accent" }) === 0)
  );
}
