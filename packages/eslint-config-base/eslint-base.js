/**
 * All formatting rRule should be managed by prettier. We turn off multiple eslint rules
 * in order to remove conflicts with prettier rules.
 */
module.exports = {
    env: { es6: true, browser: true, node: true, jest: true },
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    // > To use experimental features not supported in ESLint itself yet.
    parser: "babel-eslint",
    extends: ["eslint-config-airbnb"],
    rules: {
        "arrow-parens": "off",
        "constructor-super": 2,
        "no-cond-assign": 2,
        "no-control-regex": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-empty": 1,
        "no-extra-boolean-cast": 1,
        "no-invalid-regexp": 2,
        "no-loop-func": 1,
        "no-redeclare": 2,
        "no-undef": 2,
        "no-undefined": 2,
        "no-unreachable": 2,
        "no-unused-vars": ["error", { args: "none" }],
        "no-console": ["error", { allow: ["info", "warn", "error"] }],
        /* overrides applied by eslint-config-airbnb-base or it's peer dependencies */
        "import/prefer-default-export": "off"
    }
};
