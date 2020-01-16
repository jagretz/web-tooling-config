Configuration for javascript projects.

# eslint-config-base

Disregards _\*most_ linter settings that touch code format.

\* = Linters are intended to catch problem areas in a codebase. Occasionally,
formatting lint rules are added which do not change the affect of the code, but
may cause confusion for new developers and frustration for more experienced
developers.

Not all formatting rules provided by linters are disabaled, but this configuration
does limit the number of formatting rules that do come enabled.

**Dependencies**

- [babel-eslint](https://github.com/babel/babel-eslint)
- [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc/)
