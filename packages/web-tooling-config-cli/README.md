Configure and install common project dependencies.

# web-tooling-config-cli

- [web-tooling-config-cli](#web-tooling-config-cli)
  - [Use](#use)
    - [Updating Existing Projects](#updating-existing-projects)
    - [Customizations and Overrides](#customizations-and-overrides)
  - [What gets Installed](#what-gets-installed)
  - [Contributing](#contributing)
  - [License](#license)

## Use

Running

```bash
npx @jagretz/web-tooling-config-cli
```

starts the CLI. When the process spins up you are prompted for the project
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

## What gets Installed

The CLI will configure a project for one of the following environments:

1. Browser
2. Browser - React
3. Node

Every environment type will generate a set of configurations which may include
configurations for the following tools:

- editorconfig
- prettier
- eslint
- stylelint
- lint-staged
- .gitignore

Every environment type will also install a corresponding set of dependencies:

| Dependency  | Browser | Browser - React | Node |
| :---------- | :-----: | :-------------: | :--: |
| eslint      |   ✔️    |       ✔️        |  ✔️  |
| prettier    |   ✔️    |       ✔️        |  ✔️  |
| lint-staged |   ✔️    |       ✔️        |  ✔️  |
| stylelint   |   ✔️    |       ✔️        |  ❌  |

`eslint` and `stylelint` are marked as `peerDependencies` and should be
installed outside of this tool if your project requires them.

## Contributing

Feel welcome to create an issue explaining the feature and how it would benefit
the project.

If you are already a maintainer or looking to lend a helping hand, checkout the
[Development Guide](../../DEVELOPMENT.md) at the project root.

## License

Refer to [LICENSE](./LICENSE)
