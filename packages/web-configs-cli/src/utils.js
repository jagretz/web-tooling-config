/**
 * @module utils
 *
 * @desc Exports general use-case utilities for the cli and all modules.
 */

module.exports = {
    filterPackageDependencies,
    safeSpawn
};

// * filters the cw package devDeps by the project type.
async function filterPackageDependencies(projectDependencies, packageJson) {
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

/*
Why we use `child_process.spawn` over `child_process.exec`

exec buffers the command's entire output instead of using a stream. In other
words, you'll receive the WHOLE output instead of a stream of messages
as each message (output) is generated.

spawn can directly use IO streams of the parent/caller by specifying
`stdio: inherit` option. This allows the output from the executing script to
be displayed as messages are emitted (received).
*/
/* where code = { success: 0, error: 1 }  */
async function safeSpawn(spawnNpmProcess) {
    try {
        await spawnAsPromise(spawnNpmProcess);
        return 0;
    } catch (error) {
        console.log("Error occured in safeSpawn:", error);
        return 1;
    }
}

function spawnAsPromise(invokeProcess) {
    /*
    ! `error` from `spawn` is not the same as `stderr`.
    Errors are throwable and can be caught with a try/catch. `stderr` are
    streams written as received and therefore not throwable unless collected
    through a buffer and thrown as an `Error`.
    */
    return new Promise((resolve, reject) => {
        const sp = invokeProcess();

        /* code: { success: 0, error: 1 }  */
        sp.on("close", code => {
            if (code === 0) {
                resolve();
            }
            reject();
        });
        process.on("error", reject);
    });
}

function installPackageDependencies() {}

function mergePackageScripts() {}
