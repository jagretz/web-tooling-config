/**
 * @module sources
 *
 * @desc Exports configuration source file names and associated meta-data.
 */

/**
 * @type {array<string>} names of the configuration files.
 */
const configFiles = [
    /* formatters */
    ".editorconfig",
    ".prettierrc.js",
    ".prettierignore",
    /* linters - Javascript */
    ".eslintrc.js",
    ".eslintignore",
    /* linters - CSS */
    ".stylelintrc.js",
    ".stylelintignore",
    /* Project config files */
    ".gitignore"
];

/**
 * @type {array<string>} names of the "overrides" configuration files.
 */
const overridesFiles = ["eslint-overrides.js", "stylelint-overides.js"];

/**
 * Files applicable to any environment and project.
 *
 * Each element is a structure with:
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 *
 * This structure helps to distinguish between configs that may have the same
 * destination, but a different name for the source. eg.
 * `eslint-base` and `eslint-react` both combine into `.eslintrc`.
 */
const base = [
    { source: ".gitignore", destination: ".gitignore" },
    { source: ".editorconfig", destination: ".editorconfig" },
    { source: ".prettierrc.js", destination: ".prettierrc.js" },
    { source: ".prettierignore", destination: ".prettierignore" },
    { source: "eslint-config-base.js", destination: ".eslintrc.js" },
    { source: "eslint-overrides.js", destination: "eslint-overrides.js" },
    { source: ".eslintignore", destination: ".eslintignore" }
];

/**
 * Files specific to browser environments.
 * @type {array<object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const browser = [
    { source: ".stylelintrc.js", destination: ".stylelintrc.js" },
    { source: "stylelint-overrides.js", destination: "stylelint-overrides.js" },
    { source: ".stylintignore", destination: ".stylintignore" }
];

/**
 * Files specific to react projects.
 * @type {array<object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const react = [{ source: "eslint-react.js", destination: ".eslintrc.js" }];

/**
 * Files specific to node environments.
 * @see #base
 */
const node = base;

module.exports = {
    configFiles,
    overridesFiles,
    base,
    browser,
    react,
    node
};
