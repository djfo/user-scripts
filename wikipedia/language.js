// ==UserScript==
// @name     Unnamed Script 543499
// @version  1
// @grant    none
// @include https://*.wikipedia.org/wiki/*
// ==/UserScript==

const langs = ["en", "de", "fr", "it"];

const links = [...document.querySelectorAll(".interlanguage-link a")];

const map = new Map(links.flatMap(link => {
  const href = link.href;
  const lang = link.lang;
  const record = { lang, href };
  return langs.includes(lang) ? [[lang, record]] : [];
}));

const keyCode1 = 0x31;
const bindings = new Map(langs.map((lang, index) => [keyCode1 + index, lang]));

const ul = document.createElement("ul");
ul.style = "list-style: none; margin: 0; padding: 0";
let index = 0;
for (const lang of langs) {
  index++;
  const value = map.get(lang);
  const li = document.createElement("li");
  li.style = "margin: 0; padding: 0";
  const textNode = document.createTextNode(`${index} ${lang}`);
  if (value !== undefined) {
    const { href } = value;
    const a = document.createElement("a");
    a.appendChild(textNode);
    a.href = href;
    li.appendChild(a);
  } else {
    li.appendChild(textNode);
  }
  ul.appendChild(li);
}
const div = document.createElement("div");
div.style = "position: fixed; top: 0; right: 0; background: yellow";
div.appendChild(ul);
document.body.appendChild(div);

document.addEventListener('keydown', (ev) => {
  const activeElement = document.activeElement;

  if (activeElement !== document.body) {
    return;
  }

  const binding = bindings.get(ev.keyCode);

  if (binding !== undefined) {
    const lang = binding;
    const { href } = map.get(lang);
    window.location = href;
  }
});
