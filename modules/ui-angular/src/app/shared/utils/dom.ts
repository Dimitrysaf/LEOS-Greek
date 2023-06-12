export const setDynamicStyle = (
  document: Document,
  cssURL: string,
): HTMLLinkElement => {
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = cssURL;
  head.appendChild(style);

  return style;
};

export const swapElements = (oldElem: HTMLElement, newElem: HTMLElement) => {
  oldElem.parentNode.insertBefore(newElem, oldElem);
  oldElem.remove();
};

export const getScrollParent = (node: Node): Element | undefined => {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return;
  }

  const isScrollParent = (el: Element) => {
    const overflow = getComputedStyle(el).getPropertyValue('overflow');
    return /(auto|scroll)/.test(overflow);
  };

  const parents = getParentNodes(node, []);
  const _scrollParent = parents.find(isScrollParent) as Element | undefined;

  return _scrollParent ?? document.scrollingElement ?? document.documentElement;
};

export const getParentNodes = (
  node: Node,
  parents: ParentNode[],
): ParentNode[] => {
  const parent = node.parentNode;
  if (parent === null) {
    return parents;
  }
  return getParentNodes(parent, [...parents, parent]);
};

export type ScrollInParentOptions = {
  top?: number | null;
  left?: number | null;
  topOffset?: number;
  leftOffset?: number;
  behavior?: ScrollBehavior;
};

/**
 * Scrolls to the top of an element within its scroll parent.
 *
 * @param el The element to scroll to.
 * @param options The options for scrolling.
 * @param options.top Pass `null` to skip horizontal scrolling.
 * @param options.left Pass `null` to skip horizontal scrolling.
 * @param options.topOffset An optional number of pixels to offset the `top` by.
 * @param options.leftOffset An optional number of pixels to offset the `left` by.
 */
export const scrollInParent = (
  el: HTMLElement,
  options: ScrollInParentOptions = {},
) => {
  const scrollParent = getScrollParent(el);
  let _rects: { parent: DOMRect; child: DOMRect };
  const getRects = () => {
    if (!_rects) {
      _rects = {
        parent: scrollParent.getBoundingClientRect(),
        child: el.getBoundingClientRect(),
      };
    }
    return _rects;
  };
  const getTop = () => {
    if (options.top === null) {
      return undefined;
    }

    const top =
      options.top ??
      Math.abs(
        getRects().parent.top - getRects().child.top - scrollParent.scrollTop,
      );
    const offset = options.topOffset ?? 0;

    return top - offset;
  };
  const getLeft = () => {
    if (options.left === null) {
      return undefined;
    }

    const left =
      options.left ??
      Math.abs(
        getRects().parent.left -
          getRects().child.left -
          scrollParent.scrollLeft,
      );
    const offset = options.leftOffset ?? 0;

    return left - offset;
  };

  scrollParent.scrollTo({
    top: getTop(),
    left: getLeft(),
    behavior: options.behavior,
  });
};
