/**
 * All formatting rules should be managed by prettier, NOT a linter. Therefore,
 * multiple eslint rules are turned off in order to remove conflicts with prettier rules.
 * This is accomplished primarily with eslint-config-prettier and secondly through
 * manual rule setting.
 */
module.exports = {
    env: { es6: true, browser: true, node: true, jest: true },
    parserOptions: {
        ecmaVersion: 9,
        sourceType: "module"
    },
    settings: {
        jsdoc: {
            preferredTypes: {
                object: "Object"
            }
        }
    },
    // babel-eslint allows the use of experimental features not supported by eslint.
    parser: "babel-eslint",
    extends: ["airbnb-base", "plugin:jsdoc/recommended", "prettier"],
    // airbnb-base peerDep for eslint-plugin-import and we also want it.
    plugins: ["import", "jsdoc"],
    rules: {
        "arrow-parens": 0,
        "constructor-super": 2,
        curly: [2, "all"],
        "no-cond-assign": 2,
        "no-console": ["error", { allow: ["info", "warn", "error"] }],
        "no-control-regex": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-empty": 1,
        "no-extra-boolean-cast": 1,
        "no-invalid-regexp": 2,
        "no-loop-func": 1,
        "no-plusplus": 0,
        "no-redeclare": 2,
        "no-undef": 2,
        "no-undefined": 2,
        "no-unreachable": 2,
        "no-unused-vars": [
            "error",
            { args: "after-used", ignoreRestSiblings: true, caughtErrors: "all" }
        ],
        /* override rules applied by eslint-config-airbnb-base or its peer dependencies */
        "import/prefer-default-export": 0,
        /* override rules applied by eslint-plugin-jsdoc or its peer dependencies */
        // This rule only affects formatting.
        "jsdoc/newline-after-description": 0,
        // Allow custom types without the need for explicit type declaration imports.
        "jsdoc/no-undefined-types": 0,
        // This rule is too stringent to be applied to all functions.
        "jsdoc/require-jsdoc": 0,
        // Allows us to use Object and object interchangable... among others.
        "jsdoc/check-types": 0,
        // Similar to the check-types rule but applies to tags.
        "jsdoc/valid-types": 0
    }
};
