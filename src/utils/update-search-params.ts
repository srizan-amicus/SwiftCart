export type SearchParamChanges = Record<string, string | undefined>;

export function updateSearchParams(
  currentQuery: string,
  changes: SearchParamChanges,
  resetPage = true,
): string {
  const params = new URLSearchParams(currentQuery);

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  if (resetPage && !Object.hasOwn(changes, "page")) {
    params.delete("page");
  }

  return params.toString();
}
