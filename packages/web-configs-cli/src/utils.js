/**
 * @module utils
 *
 * @desc Exports general use-case utilities for the cli and all modules.
 */

// * filters the cw package devDeps by the project type.
async function filterPackageDependencies(projectDependencies, packageJson) {
    // return the devDeps to be installed ONLY if they don't already
    // exist in the destination projects devDeps.

    // perf is not a big deal here considering how few items we are
    // looping through, however, performance improvements can be future feature 👍
    return projectDependencies.reduce((accum, curr) => {
        console.log("accum", accum);
        return accum;
    }, []);
}

module.exports = {
    filterPackageDependencies
};
