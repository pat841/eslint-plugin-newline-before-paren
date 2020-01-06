# eslint-plugin-newline-before-paren

ESLint rule to disallow newlines before parenthesis on single lines.

# Installation

After having installed [ESLint](https://www.github.com/eslint/eslint), install the rule:

```bash
$ npm install eslint-plugin-newline-before-paren --save-dev
```

# Configuration

Add `newline-before-paren` to your `.eslintrc`:

```json
{
  "plugins": [
    "newline-before-paren"
  ],
  "rules": {
    "newline-before-paren/newline-before-paren": 2
  }
}
```

## Fail

```javascript
const result = someArray.map((item) => item.prop
);
```

## Pass

```javascript
const result = someArray.map((item) => item.prop);
```
