[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# web-tooling-config

👀 Looking for the API? You probably want the
[cli](./web-tooling-config-cli/README)

A monorepo of linter, formatter, and other tooling configurations intended for
use in web projects: Projects built with javascript and css. Includes setup for
the browser and node.

Includes packages for:

**Formatters**

- editorconfig
- prettier

**Linters**

- eslint
- stylelint

**Tools**

- lint-staged

**Other**

- .gitignore

## Development

Individual package maintenance should flow through this parent package. Refer to
[lerna](https://github.com/lerna/lerna) for the complete cli.

To publish a new package:

```bash
lerna publish
```

This will ask you for the version bump and publish automatically for you.

- Only publishes packages that have changes since the last release
- Bumps the version automatically in each package
- Makes a separate
