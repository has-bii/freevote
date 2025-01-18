export default function filterSearchParams<T>(
  param: string | string[] | undefined,
  type: "string" | "array",
): T {
  if (param === undefined)
    switch (type) {
      case "string":
        return undefined as T;

      case "array":
        return undefined as T;
    }

  if (typeof param === "string")
    switch (type) {
      case "string":
        return param.length === 0 ? (undefined as T) : (param as T);

      case "array":
        return [param] as T;
    }

  if (typeof param === "object")
    switch (type) {
      case "string":
        return param.pop() as T;

      case "array":
        return param as T;
    }

  return param as T;
}
