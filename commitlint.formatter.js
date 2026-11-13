// Friendly commitlint output: plain-English problems, expected format, allowed types and examples.
// Used via `--format ./commitlint.formatter.js` (see .husky/commit-msg and package.json "lint:commit").
const conventional = require('@commitlint/config-conventional');
const { rules } = conventional.default || conventional;

const allowedTypes = rules['type-enum'][2];
const maxHeaderLength = rules['header-max-length'][2];

const explanations = {
  'type-empty': 'No "type: " prefix found. Start the message with a type, e.g. "fix: correct navbar locator".',
  'subject-empty': 'Missing the subject, i.e. the text after "type: ".',
  'type-enum': `Unknown type. Use one of: ${allowedTypes.join(', ')}.`,
  'type-case': 'The type must be lower case, e.g. "fix:" not "Fix:".',
  'subject-full-stop': 'Remove the full stop (.) at the end of the subject.',
  'subject-case': 'The subject must not be Sentence case, Start Case, PascalCase or UPPER CASE. Start it in lower case.',
  'header-max-length': `The first line is too long. Keep it within ${maxHeaderLength} characters.`,
  'header-trim': 'Remove spaces at the start or end of the first line.',
  'body-leading-blank': 'Leave one blank line between the first line and the body.',
  'footer-leading-blank': 'Leave one blank line before the footer.',
};

// Type problems come first; some rules are only a side effect of another one, so they are dropped
const order = ['type-empty', 'type-case', 'type-enum', 'subject-empty', 'subject-case', 'subject-full-stop'];

function relevantErrors(errors) {
  const names = errors.map((e) => e.name);
  return errors
    .filter((e) => !(e.name === 'subject-empty' && names.includes('type-empty'))) // no "type: " means no subject was parsed either
    .filter((e) => !(e.name === 'type-enum' && names.includes('type-case'))) // "Fix" is only wrong because of its case
    .sort((a, b) => {
      const ia = order.indexOf(a.name);
      const ib = order.indexOf(b.name);
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
}

module.exports = function format(report = {}) {
  const results = (report.results || []).filter((result) => result.errors.length > 0);
  if (results.length === 0) return '';

  return results
    .map((result) => {
      const firstLine = (result.input || '').split('\n')[0];

      const problems = [...new Set(relevantErrors(result.errors).map((e) => explanations[e.name] || e.message))];

      // "fix:" with nothing after it is parsed as having no type, but the real problem is the missing subject
      if (/^[a-z]+(\([^)]*\))?!?:\s*$/i.test(firstLine)) {
        problems.splice(0, problems.length, explanations['subject-empty']);
      }

      return [
        '',
        '✖ Commit rejected: the message does not follow the Conventional Commits format.',
        '',
        `  Your message : ${firstLine}`,
        '',
        '  What to fix:',
        ...problems.map((p) => `    - ${p}`),
        '',
        '  Expected format : type(optional-scope): subject',
        `  Allowed types   : ${allowedTypes.join(', ')}`,
        '',
        '  Good examples:',
        '    fix: correct navbar logo locator',
        '    feat(topBanner): add testing guide close',
        '    docs: add commit lint notes',
        '',
      ].join('\n');
    })
    .join('\n');
};
