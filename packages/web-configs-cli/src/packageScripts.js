/**
 * @module packageScripts
 *
 * @desc Exports utilities useful in constructing the `scripts` property
 * of `package.json`.
 */

const { NODE } = require("./projectTypes");

/**
 * `package.scripts` common to any javascript project.
 */
const scripts = {
    eslint: "eslint ./",
    prettier: 'prettier --write "./**/*.{js,jsx,css,scss,html,json,md,mdx}"'
};

/**
 * `package.scripts` specific to browser-based projects.
 */
const browserScripts = {
    stylelint: 'stylelint "./**/*.{css,scss}"'
};

/**
 * `package.scripts` specific to node-based projects.
 */
const nodeScripts = {};

function getScriptsByProjectType(type) {
    return {
        ...scripts,
        ...(type === NODE ? nodeScripts : browserScripts)
    };
}

module.exports = {
    getScriptsByProjectType
};
