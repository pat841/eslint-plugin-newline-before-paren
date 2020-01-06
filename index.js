/**
 * @fileoverview Rule to disallow newlines before parenthesis on single lines.
 * @author Pat Herlihy
 */
'use strict';

// Helpers
const helpers = {
  isTokenOnSameLine: (left, right) => left.loc.end.line === right.loc.start.line,
  isOpeningParenToken: (token) => token.value === "(" && token.type === "Punctuator",
  isClosingParenToken: (token) => token.value === ")" && token.type === "Punctuator",
};

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow newlines before parenthesis on single lines.',
      category: 'Stylistic Issues',
      recommended: false,
      url: 'https://github.com/pat841/eslint-plugin-newline-before-paren',
    },
    fixable: 'whitespace',
  },
  rules: {
    'newline-before-paren': {
      create: function(context) {
        const sourceCode = context.getSourceCode();

        function hasNewlineBeforeToken(prevToken, closingParenToken, openingParenToken) {
          const isTokenOnSameLine = helpers.isTokenOnSameLine(prevToken, closingParenToken);
          const isSpaceBetweenTokens = sourceCode.isSpaceBetweenTokens(prevToken, closingParenToken);
          const isSingleLineAndHasNewlinesOrSpaces = (
            helpers.isTokenOnSameLine(openingParenToken, prevToken) &&
            (!isTokenOnSameLine || isSpaceBetweenTokens)
          );

          if (!isTokenOnSameLine && !isSingleLineAndHasNewlinesOrSpaces) {
            return false;
          }

          if (!isSpaceBetweenTokens && !isSingleLineAndHasNewlinesOrSpaces) {
            return false;
          }

          return true;
        }

        return {
          Program: function checkNewlineBeforeParen(node) {
            const tokens = sourceCode.tokensAndComments;
            const openingParens = [];

            tokens.forEach((token, i) => {
              const prevToken = tokens[i - 1];
              const nextToken = tokens[i + 1];

              // if token is not an opening or closing paren token, do nothing
              if (!helpers.isOpeningParenToken(token) && !helpers.isClosingParenToken(token)) {
                return;
              }

              // Get the matching open paren
              if (helpers.isOpeningParenToken(token)) {
                openingParens.push(token);
              }
              const openingParen = (helpers.isClosingParenToken(token)) ? openingParens.pop() : void 0;

              if (token.value === ")" && hasNewlineBeforeToken(prevToken, token, openingParen)) {
                context.report({
                  node,
                  loc: { start: prevToken.loc.end, end: token.loc.start },
                  message: "There should be no space before this paren.",
                  fix(fixer) {
                    return fixer.removeRange([prevToken.range[1], token.range[0]]);
                  },
                });
              }
            });
          },
        };
      },
    },
  },
};
