# `web-configs-cli`

[configuring eslint](https://eslint.org/docs/user-guide/configuring)

> TODO: description

## Install

## Usage & Customizations

### Overriding the default configuration

For example, maybe you want to specify another (such as `jasmine`)
[environemnt](https://eslint.org/docs/user-guide/configuring#specifying-environments)
or
[custom globals](https://eslint.org/docs/user-guide/configuring#specifying-globals)

Or use
[configuration cascade](https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy)

## What gets Installed

"extends": [ "eslint:recommended",

List deps here...

[eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)

[eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)

## Customizations

## How it works

Naming of packages `eslint-config`
https://eslint.org/docs/user-guide/configuring#using-a-shareable-configuration-package

## Life Choices

The packages have no deps. They don't need them since they are supposed to be
used with the cli, not as stand alone packages.

### Eslint Configuration

`env` es6, jest, react, node, etc. You can specify multip

`parser` [babel-eslint](https://www.npmjs.com/package/babel-eslint)

> To use experimental features not supported in ESLint itself yet.

`ecmaVersion` latest or 2019. Same reason for the choice in a parser.

> supporting ES6 syntax is not the same as supporting new ES6 globals

`ecmaFeatures`

    `jsx`

    > supporting JSX syntax is not the same as supporting React.

`plugins` react

## Troubleshooting

## Contributing

## License
