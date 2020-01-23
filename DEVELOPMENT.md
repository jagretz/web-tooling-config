[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# Development Guide

This project is maintained with [lerna](https://github.com/lerna/lerna) 🐉.
Lerna is used to manage child packages, versioning, and releases.

- [Development Guide](#development-guide)
  - [Install](#install)
  - [Development](#development)
  - [Tooling](#tooling)
  - [Versioning and Publishing](#versioning-and-publishing)

This project manages package configurations for the following tooling:

- editorconfig
- prettier
- eslint
- stylelint
- lint-staged

Additionally, a `.gitignore` configuration is included as part of the
`web-tooling-config-cli`.

## Install

1. Clone the repo
   ```bash
   # pulls down the entire monorepo
   git clone git@github.com:jagretz/web-tooling-config.git
   ```
2. Install root (monorepo) dependencies
   ```bash
   # from the root package ./web-toolin-config
   npm install
   ```

Side note: the documentation suggests running `lerna install` and
`lerna bootstrap` but this isn't necessary. See
[comment](https://github.com/lerna/lerna/issues/2391#issuecomment-569343564)

## Development

The `web-tooling-config-cli` package is the CLI. Any features related to the CLI
should be added here.

Other packages (under `./packages`) contain the configurationss for specific
tools such as `eslint`, `stylelint`, and `editorconfig` (to name just a few).

When new dependencies are added to any package, run `lerna bootstrap` from the
project monorepo root to install and
[symlink](https://en.wikipedia.org/wiki/Symbolic_link) all local package
dependencies.

The tools configurations are primarily static files. The CLI
`packages/web-tooling-config-cli/cli.js` is where the development happens.

Read the
[CLI development guide](./tree/master/packages/web-tooling-config-cli/DEVELOPMENT.md)
for instructions on testing and debugging.

## Tooling

Git `pre-commit` hooks runs on every commit. This is enabled thanks to
[husky](https://github.com/typicode/husky) 🐶 and
[`lint-staged`](https://github.com/okonet/lint-staged)

There is no build step so the client will get the non-minified, non-obfuscated
code.

## Versioning and Publishing

Versioning and publishing are handled at the monorepo root.

We follow the [semantic versioning](https://semver.org/) specification.

`lerna` supplies a collection of CLI options to help automate working with
multiple packages.

Below are instructions for manually running commands sequentially. More
automated options are available for advanced use.

Example: Let's assume we are making an experimental update. Therefore we will
only update the `snapshot` version using the
[time since epoch](https://en.wikipedia.org/wiki/Unix_time).

1. Create (or "bump") the version

```bash
# eg. get a snapshot version like "0.1.1-snapshot.1559682256"
echo 0.1.1-snapshot.$(date +%s)
0.1.1-snapshot.1559682256
```

2. Update package Versions

Versions of all packages are kept in-sync. Any update will increment the version
of all packages.

Running the following command to update ALL packages:

```bash
lerna version 0.1.1-snapshot.1559681721 --no-push -m "chore(release): publish %v"
# commits with message "chore(release): publish 0.1.1-snapshot.1559681721"

# version <version>         bumps the version
# --no-push                 by default `lerna version` will push the commit and git tag.
#                           Pass `no-push` to disable this behavior
# --message <message>       [-m] optional commit message
# --no-git-tag-version      By default, `lerna version` will tag the release.
#                           Pass `--no-git-tag-version` to disable the behavior.
```

Passing the `--no-push` and `--no-git-tag-version` version can be helpful during
testing and when working with multiple remote repositories (such as the original
repository and a fork of the original).

3. Publish packages

Once code has been reviewed and merged, we are ready to publish.

```bash
# Remember to get the latest from the release branch
git checkout master
git pull
# publish packages where the latest version is not present in the registry
lerna publish from-package
```

`lerna` allows us to update our package version, commit, push, and publish all
in one command, but depending on the build environment, the previous
step-by-step approach may be easier.
