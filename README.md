[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

# web-tooling-config

This README contains instructions on running the CLI. This is a monorepo that
uses the [lerna](https://github.com/lerna/lerna) monorepo management utility.

This is a CLI tool that when run, will modify the projects linting and
formatting configuration for specific tooling, as well as install project
depenedencies the configurations rely on.

- [web-tooling-config](#web-tooling-config)
  - [Usage](#usage)
  - [Usage Notes](#usage-notes)
    - [Updating Existing Projects](#updating-existing-projects)
    - [Customizations and Overrides](#customizations-and-overrides)

## Usage

_This should be run against a Javascript project (i.e. contains a valid
`package.json`), and assumes the use of git for version control._

Running

```bash
npx @jagretz/web-tooling-config-cli
```

Kicks off the CLI. When the process spins up you are prompted for a project
"type" to configure.

```bash
> what type of project do you want to configure?
>
> - browser?
> - react?
> - node?
```

Once a selection is made, the tool will add or modify existing tooling
configurations.

## Usage Notes

**Undoing Changes**

Running the CLI requires a clean git working directory. This feature allows
changes to be reverted and diffed with little effort on the part of the user.

**Notes**

The CLI will only run on [clean](https://git-scm.com/docs/git-clean) working
directories tracked by git.

This CLI may add or modify new and existing tooling configurations.

### Updating Existing Projects

Simply re-run the [CLI](#use). It will update existing configurations, but will
leave any `*-overrides` files untouched. This allows your customizations to be
retained on any subsequent updates.

### Customizations and Overrides

This package is intended to use "as is"; an out-of-the-box solution to
configuring your project with defaults. The configurations provided are not
intended to be modified directly.

However, there may be circumstances that require modification to the provided
defaults. Therefore an outlet is provided through `*-overrides` files for
overriding linter configurations.

Both an `eslint-overrides.js` and a `stylelint-overrides.js` are provided for
your use and customizations.

`*-overrides` files are not modified during subsequent updates.
