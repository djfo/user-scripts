export function parseLanguageCodesThrows(raw: string): string[] {
  const parts = raw.split(/,/);
  const filtered = parts.flatMap((part) => {
    const trimmed = part.trim();
    return trimmed.length === 0 ? [] : [trimmed];
  });
  if (filtered.length > 9) {
    throw new Error(
      "Too many language codes. At most 9 language codes are allowed."
    );
  }
  const re = /^[a-z]+$/;
  const invalid = filtered.filter((part) => !re.test(part));
  if (invalid.length > 0) {
    const message = `The following language codes are invalid: ${invalid.join(
      ", "
    )}.`;
    throw new Error(message);
  }
  return filtered;
}

export function setUserLanguageCodes(languageCodes: string[]): Promise<void> {
  const serialized = languageCodes.join(",");
  return GM.setValue("languageCodes", serialized);
}

export function setUserLanguageCodesRaw(raw: string): Promise<void> {
  const languageCodes = parseLanguageCodesThrows(raw);
  return setUserLanguageCodes(languageCodes);
}

export async function getUserLanguageCodes(): Promise<string[]> {
  // https://en.wikipedia.org/wiki/List_of_Wikipedias#Basic_list
  const defaultLanguageCodes = [
    "en",
    "fr",
    "de",
    "ja",
    "es",
    "ru",
    "pt",
    "it",
    "zh",
  ];
  try {
    const raw = await GM.getValue("languageCodes");
    if (typeof raw !== "string") {
      throw new Error("No value found.");
    }
    return parseLanguageCodesThrows(raw);
  } catch {
    console.error("Failed to get language codes from user defaults.");
    return defaultLanguageCodes;
  }
}
