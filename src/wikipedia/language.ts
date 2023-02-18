// ==UserScript==
// @name     Unnamed Script 543499
// @version  1
// @grant    none
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
      li.appendChild(a);
    } else {
      li.appendChild(textNode);
    }
    return li;
  });
  const div = document.createElement("div");
  div.setAttribute(
    "style",
    "position: fixed; top: 0; right: 0; background: yellow"
  );
  const ul = document.createElement("ul");
  ul.setAttribute("style", "list-style: none; margin: 0; padding: 0");
  ul.append(...lis);
  div.appendChild(ul);
  return div;
}

function init() {
  const langs = ["en", "de", "fr", "it"];
  const keyCode1 = 0x31;
  const links = getInterLanguageLinks();
  const map = makeMap(links, langs);

  const div = makeLanguageMenuHtml(langs, map);
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
