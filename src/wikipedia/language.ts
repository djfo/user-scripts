import { a, button, div, href, li, style, text, ul } from "../common/html";

function getInterLanguageLinks(): HTMLAnchorElement[] {
  const elements = [...document.querySelectorAll(".interlanguage-link a")];
  if (elements.every((element) => element instanceof HTMLAnchorElement)) {
    return elements as HTMLAnchorElement[];
  } else {
    throw new Error("Expected HTML anchor elements.");
  }
}

type M = Map<string, { lang: string; href: string }>;

function makeMap(links: HTMLAnchorElement[], langs: string[]): M {
  return new Map(
    links.flatMap((link) => {
      const href = link.href;
      const lang = link.lang;
      const record = { lang, href };
      return langs.includes(lang) ? [[lang, record]] : [];
    })
  );
}

function makeLanguageMenuHtml(langs: string[], map: M): HTMLElement {
  const lis = langs.map((lang, index) => {
    const value = map.get(lang);

    const baseStyle = "margin: 0; padding: 0";
    const children = [text(`${index + 1} ${lang}`)];

    if (value !== undefined) {
      return li(
        [style(baseStyle + "; font-weight: bold")],
        [a([href(value.href)], children)]
      );
    } else {
      return li([style(baseStyle + "; color: gray")], children);
    }
  });

  return div(
    [
      style(
        "position: fixed; top: 0; right: 0; background: yellow; z-index: 1000; padding: 5mm"
      ),
    ],
    [ul([style("list-style: none; margin: 0; padding: 0")], lis)]
  );
}

function parseLanguageCodesThrows(raw: string): string[] {
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

function setUserLanguageCodes(languageCodes: string[]): Promise<void> {
  const serialized = languageCodes.join(",");
  return GM.setValue("languageCodes", serialized);
}

function setUserLanguageCodesRaw(raw: string): Promise<void> {
  const languageCodes = parseLanguageCodesThrows(raw);
  return setUserLanguageCodes(languageCodes);
}

async function getUserLanguageCodes(): Promise<string[]> {
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

function makeConfiugreButton(): HTMLElement {
  const button_ = button([], [text("\u2699")]);
  button_.addEventListener("click", async () => {
    const userLanguageCodes = await getUserLanguageCodes();
    const newUserLanguageCodes = window.prompt(
      "Enter language codes separated by commas:",
      userLanguageCodes.join(", ")
    );
    if (newUserLanguageCodes === null) {
      return;
    }
    setUserLanguageCodesRaw(newUserLanguageCodes);
    location.reload();
  });
  return button_;
}

async function init(): Promise<void> {
  const languageCodes: string[] = await getUserLanguageCodes();

  const langs = languageCodes;

  const keyCode1 = 0x31;
  const links = getInterLanguageLinks();
  const map = makeMap(links, langs);

  document.body.appendChild(
    div([], [makeLanguageMenuHtml(langs, map), makeConfiugreButton()])
  );

  const bindings = new Map(
    langs.map((lang, index) => [keyCode1 + index, lang])
  );
  document.addEventListener("keydown", (ev) => {
    const activeElement = document.activeElement;

    if (activeElement !== document.body) {
      return;
    }

    const binding = bindings.get(ev.keyCode);

    if (binding !== undefined) {
      const lang = binding;
      const value = map.get(lang);
      if (value !== undefined) {
        window.location.replace(value.href);
      }
    }
  });
}

init();
