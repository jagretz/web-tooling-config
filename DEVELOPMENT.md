# Development Guide

This project is maintained with [lerna](https://github.com/lerna/lerna) 🐉.
Lerna is used to manage child packages, versioning, and releases.

- [Development Guide](#Development-Guide)
  - [Install](#Install)
  - [Development](#Development)
    - [Adding new features](#Adding-new-features)
  - [Tooling](#Tooling)
  - [Versioning and Publishing](#Versioning-and-Publishing)

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
   git clone <this_package>
   ```
2. Install root (monorepo) dependencies
   ```bash
   # from the root package ./web-toolin-config
   npm install
   ```
3. Install sub-package dependencies
   ```bash
   # from the root package ./web-toolin-config
   lerna bootstrap
   ```

## Development

The `web-tooling-config-cli` sub-package is the CLI. Any features related to the
CLI should be added here.

Other sub-packages contain the configurationss for specific tools such as
`eslint`, `stylelint`, and `editorconfig` (to name just a few).

When new dependencies are added to any sub-package, run `lerna bootstrap` from
the project monorepo root to install and symlink all local package dependencies.

### Adding new features

Navigate to the [`./packages`](./tree/master/packages) directory for a list of
all sub-packages managed by this monorepo.

Outside of tooling configuration files, the CLI `web-tooling-config-cli` is
where most of the development will be handled.

## Tooling

Git `pre-commit` hooks runs on every commit. This is enabled thanks to
[husky](https://github.com/typicode/husky) 🐶 and
[`lint-staged`](https://github.com/okonet/lint-staged)

There is no build step currently so the client gets the non-minified,
non-obfuscated code to allow easier understanding and customization of the code.

## Versioning and Publishing

Versioning and publishing are handled at the monorepo root.

We follow the [semantic versioning](https://semver.org/) specification.

`lerna` supplies a collection of CLI options to help automate working with
multiple sub-packages.

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
of all sub-packages.

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
