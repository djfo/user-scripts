type Attr = [string, string];

type Childs = (HTMLElement | Text)[];

const makeElem =
  (tagName: string) =>
  (attributes: Attr[], children: Childs): HTMLElement => {
    const elem = document.createElement(tagName);
    for (const [key, value] of attributes) {
      elem.setAttribute(key, value);
    }
    elem.append(...children);
    return elem;
  };

const makeAttr =
  (attributeName: string) =>
  (value: string): Attr =>
    [attributeName, value];

export const a = makeElem("a");
export const button = makeElem("button");
export const div = makeElem("div");
export const li = makeElem("li");
export const ul = makeElem("ul");

export const href = makeAttr("href");
export const style = makeAttr("style");

export const text = (value: string): Text => document.createTextNode(value);
