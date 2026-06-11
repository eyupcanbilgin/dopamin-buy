export function normalizeAdHrefInput(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  const href = String(value).trim();
  return href.length > 0 ? href : null;
}

export function isSafeAdHref(href: string | null | undefined): href is string {
  if (!href) {
    return false;
  }

  if (href.startsWith("/")) {
    return !href.startsWith("//");
  }

  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function normalizeSafeAdHref(value: unknown) {
  const href = normalizeAdHrefInput(value);
  return isSafeAdHref(href) ? href : null;
}

export function isExternalAdHref(href: string) {
  return /^https?:\/\//i.test(href);
}
