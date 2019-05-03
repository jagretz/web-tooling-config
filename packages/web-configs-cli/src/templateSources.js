/**
 * @module sources
 *
 * @desc Exports configuration source file names and associated meta-data.
 */

const { BROWSER, REACT, NODE } = require("./projectTypes");

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
    { source: ".eslintignore", destination: ".eslintignore" }
];

/**
 * Files specific to environments that desire css.
 * @type {Array.<Object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const styles = [
    { source: ".stylelintrc.js", destination: ".stylelintrc.js" },
    { source: ".stylintignore", destination: ".stylintignore" }
];

/**
 * Files specific to browser environments.
 * @type {Array.<Object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const browser = [
    { source: "eslint-base.js", destination: ".eslintrc.js" },
    { source: ".stylelintrc.js", destination: ".stylelintrc.js" },
    { source: ".stylintignore", destination: ".stylintignore" },
    ...styles
];

/**
 * Files specific to react projects.
 * @type {Array.<Object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const react = [{ source: "eslint-react.js", destination: ".eslintrc.js" }, ...styles];

/**
 * Files specific to node environments.
 * @type {Array.<Object>}
 * @prop {string} source name of the file to read
 * @prop {string} destination name of the file to write
 */
const node = [{ source: "eslint-base.js", destination: ".eslintrc.js" }];

/**
 * Return a collection of sources based upon the passed #type.
 * @param {string} type
 * @returns {Array.<Object>} array of k,v pairs mapping the filename to copy
 * (the source), and the copy-to filename (destination)
 */
function getSourcesByProjectType(type) {
    return [
        ...base,
        ...(type === BROWSER ? browser : []),
        ...(type === REACT ? react : []),
        ...(type === NODE ? node : [])
    ];
}

module.exports = {
    getSourcesByProjectType,
    overridesFiles
};
