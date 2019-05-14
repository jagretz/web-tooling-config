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
    "eslint",
    "babel-eslint",
    "@dominos-pulse/eslint-config-base",
    "eslint-config-airbnb",
    "eslint-plugin-import",
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
const stylesProjectDependencies = [
    "stylelint",
    "stylelint-config-recommended-scss",
    "stylelint-scss"
];

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
const reactProjectDependencies = [
    "eslint-plugin-react",
    "eslint-plugin-jsx-a11y",
    ...stylesProjectDependencies
];

/**
 * `package.devDependencies` that are to be installed into the destination
 * project. Specific to node-based projects.
 *
 * @type {Array.<string>}
 */
const nodeProjectDependencies = [];

/**
 *
 * @param {string} type the project type matching
 * @returns {Array.<string>} array of strings representing the project
 * devDependencies that should be installed.
 */
const getDevDependenciesByProjectType = type => {
    return [
        ...projectDependencies,
        ...(type === NODE ? nodeProjectDependencies : []),
        ...(type === BROWSER ? browserProjectDependencies : []),
        ...(type === REACT ? reactProjectDependencies : [])
    ];
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
        "Spawning asynchrouns npm process to install devDependencies:",
        devDependenciesToInstall
    );

    const responseCode = await safeSpawn(spawnNpmProcess.bind(null, devDependenciesToInstall));

    if (responseCode === 0) {
        logger.success("Successfully installed package dependencies.", devDependenciesToInstall);
    } else {
        logger.error(
            "Failed to install the following one or more package dependencies:",
            devDependenciesToInstall
        );
    }

    return responseCode;
}

/**
 * Take only packages in the left that do not exist in the right; the left difference.
 *
 * @param {Array.<string>} projectDependencies prospective dependencies
 * @param {Array.<object>} packageJson same structure as a `package.json`s
 * `devDependencies` structure. ie { "name-of-package" : "^0.1.0" }
 * @returns {Array.<string>} array of string names for the dependencies.
 */
function leftOuterJoin(projectDependencies, packageJson) {
    // return the devDeps to be installed ONLY if they don't already
    // exist in the destination projects devDeps.

    // perf is not a big deal here considering how few items we are
    // looping through, however, performance improvements can be future feature 👍
    return projectDependencies.reduce((accum, curr) => {
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
