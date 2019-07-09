/* eslint-disable no-use-before-define */
// * eslint: This modules is a series of functions
// * declarations that are declared before any use.
/**
 * @module packageSources
 *
 * @desc Exports utils useful in constructing the `package.json`.
 */

/** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
const { spawn } = require("child_process");
const logger = require("./colorLog");
const { safeSpawn } = require("./utils");
const { BROWSER, REACT, NODE } = require("./projectTypes");

/**
 * `package.devDependencies`  that are to be installed into the destination
 * project. Specific to ALL projects.
 *
 * @type {Array.<string>}
 */
const projectDependencies = [
    // TODO: 06/04/19 jagretz - Install the following dependency(s) _only if_ they are not found
    // in the node_modules dependency tree -- this would assume the dependency(s) were installed
    // by another module, and is not necessarily required to install with this package:
    // ["eslint"] for projectDependencies,
    // ["stylelint"] for stylesProjectDependencies
    "@jagretz/eslint-config-base",
    "prettier",
    "husky",
    "lint-staged"
];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to any project that wants to use css.
 *
 * @type {Array.<string>}
 */
const stylesProjectDependencies = ["@jagretz/stylelint-config-base"];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to browser-based projects.
 *
 * @type {Array.<string>}
 */
const browserProjectDependencies = [...stylesProjectDependencies];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to react.js projects.
 *
 * @type {Array.<string>}
 */
const reactProjectDependencies = ["@jagretz/eslint-config-react", ...stylesProjectDependencies];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to node-based projects.
 *
 * @type {Array.<string>}
 */
const nodeProjectDependencies = [];

/**
 * Return the dependencies that apply to a specific project type.
 * @param {string} type the project type matching
 * @returns {Array.<string>} array of strings representing the project
 * devDependencies that should be installed.
 */
const getDevDependenciesByProjectType = type => {
    let projectSpecificDependencies;
    switch (type) {
        case BROWSER:
            projectSpecificDependencies = browserProjectDependencies;
            break;
        case REACT:
            projectSpecificDependencies = reactProjectDependencies;
            break;
        case NODE:
            projectSpecificDependencies = nodeProjectDependencies;
            break;
        default:
            projectSpecificDependencies = [];
    }
    return [...projectDependencies, ...projectSpecificDependencies];
};

/**
 * Installs package dependencies that are not already included in the package.json
 * of the target package.
 *
 * @param {string} projectType
 * @param {object} packageDevDependencies same structure as a `package.json`s
 * `devDependencies` structure. ie { "name-of-package" : "^0.1.0" }
 */
async function installPackageDependencies(projectType, packageDevDependencies) {
    const dependenciesByProjectType = getDevDependenciesByProjectType(projectType);
    const devDependenciesToInstall = leftOuterJoin(
        dependenciesByProjectType,
        packageDevDependencies
    );

    logger.log(
        "Spawning asynchronous npm process to install devDependencies:",
        devDependenciesToInstall
    );

    let responseCode;
    try {
        responseCode = await safeSpawn(spawnNpmProcess.bind(null, devDependenciesToInstall));
    } catch (error) {
        logger.error(
            "Failed to install the following one or more package dependencies:",
            devDependenciesToInstall
        );
        logger.error(error);
    }

    if (responseCode === 0) {
        logger.success("Successfully installed package dependencies.", devDependenciesToInstall);
    }
    return responseCode;
}

/**
 * Take only packages in the left that do not exist in the right; the left difference.
 *
 * @param {Array.<string>} packageDependencies prospective dependencies
 * @param {Array.<object>} packageJson same structure as a `package.json`s
 * `devDependencies` structure. ie { "name-of-package" : "^0.1.0" }
 * @returns {Array.<string>} array of string names for the dependencies.
 */
function leftOuterJoin(packageDependencies, packageJson) {
    // return the devDeps to be installed ONLY if they don't already
    // exist in the destination projects devDeps.

    // perf is not a big deal here considering how few items we are
    // looping through, however, performance improvements can be future feature 👍
    return packageDependencies.reduce((accum, curr) => {
        if (Reflect.has(packageJson, curr)) {
            return accum;
        }

        accum.push(curr);
        return accum;
    }, []);
}

/**
 * Spawns a new npm process that considers the OS.
 * Installs, package deps as `devDependencies`.
 * @param {Array.<string>} dependencies list of string names for npm any
 * dependencies to be installed.
 * @returns {ChildProcess} the spawned process
 */
function spawnNpmProcess(dependencies) {
    return spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["install", "--save-dev", ...dependencies],
        {
            stdio: "inherit"
        }
    );
}

module.exports = {
    getDevDependenciesByProjectType,
    installPackageDependencies
};
