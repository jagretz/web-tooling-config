/**
 * @module packageSources
 *
 * @desc Exports utils useful in constructing the `package.json`.
 */

/** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
const { spawn } = require("child_process");
const logger = require("./colorLog");
const { leftOuterJoin, safeSpawn } = require("./utils");
const { BROWSER, REACT, NODE } = require("./projectTypes");

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

const getDevDependenciesByProjectType = type => {
    return projectDependencies.concat(
        type === BROWSER ? browserProjectDependencies : [],
        type === NODE ? browserProjectDependencies : [],
        type === REACT ? browserProjectDependencies.concat(reactProjectDependencies) : []
    );
};

async function installPackageDependencies(projectType, packageDevDependencies) {
    const dependenciesByProjectType = getDevDependenciesByProjectType(projectType);
    const devDependenciesToInstall = leftOuterJoin(
        dependenciesByProjectType,
        packageDevDependencies
    );

    // const responseCode = await safeSpawn(spawnNpmProcess(devDependenciesToInstall));
    const responseCode = await safeSpawn(spawnNpmProcess);

    if (responseCode === 0) {
        logger.success("Successfully installed package dependencies.");
    } else {
        logger.error(`Failed to install package dependencies: ${devDependenciesToInstall}`);
    }
}

function spawnNpmProcess(dependencies) {
    return spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        // testing... comment / uncomment lines to test.
        // ["install", "husky", "jagretz"],
        // destructure dependencies here
        ["install", "--save-dev", "husky"],
        {
            stdio: "inherit"
        }
    );
}

module.exports = {
    getDevDependenciesByProjectType,
    installPackageDependencies
};
