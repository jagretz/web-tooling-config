/**
 * @module sources
 *
 * @desc Exports configuration source file names and
 * associated meta-data.
 */

const configFiles = [
    /* formatters */
    ".editorconfig",
    ".prettierrc",
    ".prettierignore",
    /* linters - Javascript */
    ".eslintrc",
    ".eslintignore",
    /* linters - CSS */
    ".stylelintrc",
    ".stylelintignore",
    /* Project config files */
    ".gitignore"
];

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
    { source: ".prettierrc", destination: ".prettierrc" },
    { source: ".prettierignore", destination: ".prettierignore" },
    { source: "eslint-config-base", destination: ".eslintrc" },
    { source: "eslint-overrides.js", destination: "eslint-overrides.js" },
    { source: ".eslintignore", destination: ".eslintignore" }
];

/**
 * Files specific to browser environments
 */
const browser = [
    { source: ".stylelintrc", destination: ".stylelintrc" },
    { source: "stylelint-overrides.js", destination: "stylelint-overrides.js" },
    { source: ".stylintignore", destination: ".stylintignore" }
];

/**
 * Files specific to react projects
 */
const react = [{ source: "eslint-config-react", destination: ".eslintrc" }];

/**
 * Files specific to node environments
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
