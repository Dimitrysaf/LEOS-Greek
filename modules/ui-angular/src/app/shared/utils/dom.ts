export const setDynamicStyle = (
  document: Document,
  cssURL: string,
): HTMLLinkElement => {
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('link');
  style.id = 'css-styling';
  style.rel = 'stylesheet';
  style.href = cssURL;
  head.appendChild(style);

  return style;
};

export const swapElements = (oldElem: HTMLElement, newElem: HTMLElement) => {
  oldElem.parentNode.insertBefore(newElem, oldElem);
  oldElem.remove();
};
