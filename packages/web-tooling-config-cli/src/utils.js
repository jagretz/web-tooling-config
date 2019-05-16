/**
 * @module utils
 *
 * @desc Exports general use-case utilities for the cli and all modules.
 */

/*
Why we use `child_process.spawn` over `child_process.exec`:

`exec` buffers the command's entire output instead of using a stream. In other
words, you'll receive the WHOLE output instead of a _stream_ of messages
as each message (output) is generated.

`spawn` can directly use IO streams of the parent/caller by specifying
`stdio: inherit` option. This allows the output from the executing script to
be displayed as messages are emitted (received).
*/

/**
 * Wraps `spawn` with async/await, returning a success or error integer similar
 * to the error codes returned by other ChildProcess.
 *
 * @param {ChildProcess} spawnNpmProcess
 * @returns {number} `0` indicating a success or `1` indicating that there was
 * an error the ChildProcess could not handle.
 * @async
 */
async function safeSpawn(spawnNpmProcess) {
    try {
        await spawnAsPromise(spawnNpmProcess);
        return 0;
    } catch (error) {
        console.log("Error occured in safeSpawn:", error);
        return 1;
    }
}

/**
 * Wraps `spawn` in a `Promise`.
 * @returns {Promise} wrapping `spawn`.
 */
function spawnAsPromise(invokeProcess) {
    /*
    ! `error` from `spawn` is not the same as `stderr`.
    Errors are throwable and can be caught with a try/catch. `stderr` are
    streams written as received and therefore not throwable unless collected
    through a buffer and thrown as an `Error`.
    */
    return new Promise((resolve, reject) => {
        const spawnedProcess = invokeProcess();

        /* code: { success: 0, error: 1 }  */
        spawnedProcess.on("close", code => {
            if (code === 0) {
                resolve();
            } else {
                const error = new Error(
                    `Failed in promise wrapped spawn process with code: ${code}`
                );
                error.code = code;
                reject(error);
            }
        });
        spawnedProcess.on("error", reject);
    });
}

module.exports = {
    safeSpawn
};
