export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type must be one of these
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation changes
        'style', // formatting, missing semi colons, etc
        'refactor', // code change that neither fixes a bug nor adds a feature
        'test', // adding or updating tests
        'chore', // updating build tasks, package manager configs, etc
        'perf', // performance improvements
        'ci', // CI/CD changes
        'revert', // revert a previous commit
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
  },
};
