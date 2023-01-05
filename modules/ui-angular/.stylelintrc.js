module.exports = {
  customSyntax: 'postcss-scss',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier', // keep last
  ],
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,

    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-type-no-unknown': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'at-root',
          'content',
          'each',
          'else',
          'extend',
          'for',
          'function',
          'if',
          'include',
          'mixin',
          'return',
          'warn',
          'while',
        ],
      },
    ],

    /*
     * Changes over eui generated config.
     */

    // 'at-rule-empty-line-before': 'never', // handled by prettier
    // indentation: 4, // handled by prettier
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['ng-deep'] }, // allow use of `ng-deep`
    ],
    'selector-class-pattern': [
      // allow `.block__element--modifier` class names
      // language=JSRegexp
      '([a-z][a-z0-9]*)(-[a-z0-9]+)*' + // block OR default `kebap-case`
        '(__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?' + // element
        '(--([a-z][a-z0-9]*))?', // modifier
      {
        message: 'Expected class selector to be kebab-case or BEM',
        resolveNestedSelectors: true,
      },
    ],
    'no-empty-source': null,
  },
};
