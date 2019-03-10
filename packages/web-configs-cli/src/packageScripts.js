/**
 * @module packageScripts
 *
 * @desc Exports utilities useful in constructing the `scripts` property
 * of `package.json`.
 */

//  ! this is duplicated in the `cli.js` & packageSources.js.
//  ! only temporarily until we find it's rightful home
//  import { NODE } from
const NODE = "node";

/**
 * `package.scripts` common to any javascript project.
 */
const scripts = {
    precommit: "",
    eslint: "eslint ./",
    prettier: "prettier ./"
};

/**
 * `package.scripts` specific to browser-based projects.
 */
const browserScripts = {
    stylelint: "stylelint ./"
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
