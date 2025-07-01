import { ReadonlyURLSearchParams } from "next/navigation";

export function createPageURL(
  currentSearchParams:
    | ReadonlyURLSearchParams
    | URLSearchParams
    | Record<string, string>,
  currentPathname: string,
  pageNumber: number
): string {
  // Create a new URLSearchParams instance from the current params
  const params = new URLSearchParams(
    typeof currentSearchParams === "object" &&
    !(currentSearchParams instanceof URLSearchParams)
      ? Object.entries(currentSearchParams)
      : currentSearchParams
  );

  // Update the page parameter
  params.set("page", pageNumber.toString());

  // Return the new URL
  return `${currentPathname}?${params.toString()}`;
}
