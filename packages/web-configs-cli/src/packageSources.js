/**
 * @module packageSources
 *
 * @desc Exports utils useful in constructing the `package.json`. ie
 * `package.scripts`, `package.dependencies`, etc
 */

//  ! this is duplicated in the `cli.js` only temporarily until we
//  ! find it's rightful home
const BROWSER = "browser";
const REACT = "react";
const NODE = "node";

/**
 * `package.devDependencies`  that are to be installed into the destination
 * project. Specific to ALL projects.
 *
 * @type {Array.<string>}
 */
const projectDependencies = [
    "husky",
    "lint-staged",
    "eslint",
    "stylelint",
    "prettier",
    "eslint-config-prettier"
];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to browser-based projects.
 *
 * @type {Array.<string>}
 */
const browserProjectDependencies = ["@jagretz/eslint-config-base"];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to react.js projects.
 *
 * @type {Array.<string>}
 */
const reactProjectDependencies = ["@jagretz/eslint-config-react"];

/**
 * `package.scripts` that are to be installed into the destination
 * project. Specific to ALL projects.
 */
const projectScripts = {
    precommit: "",
    eslint: "eslint ./",
    stylelint: "stylelint ./",
    prettier: "prettier ./"
};

const getDevDependenciesByProjectType = type => {
    return projectDependencies.concat(
        type === BROWSER ? browserProjectDependencies : [],
        type === NODE ? browserProjectDependencies : [],
        type === REACT ? browserProjectDependencies.concat(reactProjectDependencies) : []
    );
};

module.exports = {
    getDevDependenciesByProjectType
};
