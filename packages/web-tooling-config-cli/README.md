Configure and install common project dependencies.

# web-tooling-config-cli

- [web-tooling-config-cli](#web-tooling-config-cli)
  - [What and Why](#what-and-why)
  - [Use / Install](#use--install)
    - [Customizations and Overrides](#customizations-and-overrides)
    - [Updating Existing Projects](#updating-existing-projects)
  - [What gets Installed](#what-gets-installed)
  - [Troubleshooting](#troubleshooting)
    - [Registry](#registry)
  - [Contributing](#contributing)
  - [License](#license)

## What and Why

This library will setup your project with a set of tooling configurations,
package scripts, and installs any missing package dependencies.

The configurations provided are intended to be used as is but does also provide
you a way to [override](#customizations-and-overrides) any undesired settings.

**Why?**

There are a lot of opinions, suggestions, and other bikeshedding around project
configurations, linter settings and format settings. Why fuss over something so
trivial to final project?

Instead of worrying about 2-space indentation over tabs, `.*` extensions, or
whether the linter should throw an error if someone forgets to add a new line
between functions. This cli sets up all that for you with a set of sensible
defaults.

## Use / Install

Great news! You don't need to install this library (locally or globally).
Instead use `npx` to run the cli.

```bash
npx @jagretz/web-tooling-config-cli
```

When the process spins up you have a very simple choice to make:

> what type of project do you want to configure?
>
> - browser
> - react
> - node

Make your selection and the rest is history.

**But don't Change "x"!**

If you don't want all the changes provided by this library that is OK.

The cli requires a clean git working directory. This allows you to easily pick
or undo changes made by this tool that you might not want added to your project.

### Customizations and Overrides

This package is intended to use "as is"; an out-of-the-box solution to
configuring your project with common dependencies. Therefore, it isn't intended
for any particular project to modify default configurations directly.

However, if the need arises, the default set of configurations provide an
`*-overrides` file for overriding linter configurations. Both an
`eslint-overrides.js` and a `stylelint-overrides.js` are provided for your use
and customization

### Updating Existing Projects

Simply re-run the [cli](#use). It will override everything but `*-overrides`
files. This allows your customizations to be retained on any subsequent updates.

## What gets Installed

The CLI will configure your project with as one of three types:

1. Browser
2. React
3. Node

**For all projects:**

- eslint
- prettier
- lint-staged

**Browser-specific**

Everything from "all projects" along with:

- stylelint

**React-specific**

Everything from "browser-specific" along with:

- react-specific eslint plugins

**Node-specific**

Everything from "all projects" along with:

- eslint settings for node environments

## Troubleshooting

### Registry

If most of your downloads are hosted on a registry that isn't `npm`, you may
have to create a separate `.npmrc`. Most of the time you can just manage your
registry (or have your dev-ops team) to download and host this package. However,
in cases where you can't, you may run into issue. Here is the solution.

Create a `.npmrc` file that points to the npm registry. Then when invoking npx,
point to that `.npmrc`. It doesn't matter where you put this file or even what
you name it. But in this example we use the same name, `.npmrc` and drop it
under a custom directory.

```bash
npx --userconfig C:/w/git/.npmrc  @jagretz/web-tooling-config-cli
```

## Contributing

More on this later. For now, either create an issue explaining the feature and
why.

## License

Refer to [LICENSE](./LICENSE)
