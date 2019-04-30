/**
 * All formatting rRule should be managed by prettier. We turn off multiple eslint rules
 * in order to remove conflicts with prettier rules.
 */
module.exports = {
    env: { browser: true, jest: true },
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    rules: {
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
        "no-unused-vars": ["error", { args: "none" }]
    }
};
