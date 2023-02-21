// ==UserScript==
// @name     Add keyboard shortcuts to select Wikipedia inter-language links
// @version  1
// @grant    GM.getValue
// @grant    GM.setValue
// @include https://*.wikipedia.org/wiki/*
// ==/UserScript==

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

function makeLanguageMenuHtml(langs: string[], map: M) {
  const lis = langs.map((lang, index) => {
    const value = map.get(lang);
    const li = document.createElement("li");
    li.setAttribute("style", "margin: 0; padding: 0");
    const textNode = document.createTextNode(`${index + 1} ${lang}`);
    if (value !== undefined) {
      const { href } = value;
      const a = document.createElement("a");
      a.appendChild(textNode);
      a.href = href;
      li.setAttribute("style", li.getAttribute("style") + "; font-weight: bold");
      li.appendChild(a);
    } else {
      li.setAttribute("style", li.getAttribute("style") + "; color: gray");
      li.appendChild(textNode);
    }
    return li;
  });
  const div = document.createElement("div");
  div.setAttribute(
    "style",
    "position: fixed; top: 0; right: 0; background: yellow; z-index: 1000; padding: 5mm"
  );
  const ul = document.createElement("ul");
  ul.setAttribute("style", "list-style: none; margin: 0; padding: 0");
  ul.append(...lis);
  div.appendChild(ul);
  return div;
}

function parseLanguageCodesThrows(raw: string): string[] {
  const parts = deleteWhitespace(raw).split(/,/);
  const re = /^[a-z]+$/;
  const invalid = parts.filter(part => !re.test(part));
  if (invalid.length > 0) {
    const message = `The following language codes are invalid: ${invalid.join(", ")}.`;
    throw new Error(message);
  }
  return parts;
}

function setUserLanguageCodes(languageCodes: string[]): Promise<void> {
  const serialized = languageCodes.join(",");
  return GM.setValue("languageCodes", serialized);
}

function deleteWhitespace(str: string): string {
  return str.replace(/\s/g, "");
}

function setUserLanguageCodesRaw(raw: string): Promise<void> {
  const languageCodes = parseLanguageCodesThrows(raw);
  return setUserLanguageCodes(languageCodes);
}

async function getUserLanguageCodes(): Promise<string[]> {
  const defaultLanguageCodes = ["en", "de", "fr", "it", "nl"];
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

function makeButtonDiv(): HTMLDivElement {
  const div = document.createElement("div");
  const button = document.createElement("button");
  const gear = "\u2699";
  button.appendChild(document.createTextNode(gear));
  button.addEventListener("click", async () => {
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
  div.appendChild(button);
  return div;
}

async function init(): Promise<void> {
  const languageCodes: string[] = await getUserLanguageCodes();

  const langs = languageCodes;

  const keyCode1 = 0x31;
  const links = getInterLanguageLinks();
  const map = makeMap(links, langs);

  const div = makeLanguageMenuHtml(langs, map);
  div.appendChild(makeButtonDiv());

  document.body.appendChild(div);

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
