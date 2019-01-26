const fs = require("fs");
const path = require("path");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
/** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
const { exec, spawn } = require("child_process");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
/* custom modules / non-node modules */
const logger = require("./colorLog");

const cwd = process.cwd();

const readFile = promisify(fs.readFile);
// @see https://nodejs.org/api/fs.html#fs_fs_write_fd_string_position_encoding_callback
const writeFile = promisify(fs.writeFile);

/**
 * @see [fs.stat]{@link https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback}
 * @see [Stats object] {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
 */
const statPromise = promisify(fs.stat);
const execCmd = promisify(exec);

// testing async/await with promisify-ied `fs.stat`
async function asyncStat() {
    // let stats;
    try {
        return await statPromise(path.join(cwd, ".git"));
        // console.log(`Success! ${stats}`);
    } catch (error) {
        if (error.code === "ENOENT" && error.path.endsWith(".git")) {
            /*
            errno: -4058,
            code: 'ENOENT',
            syscall: 'stat',
            path: 'C:\\ngss\\g\\web-configs\\packages\\web-configs-cli\\.git'
            */
            // console.error(`meow > Git not detected. Make sure you run this command from a "clean" git directory.`);
            logger.error(
                `Git not detected. Make sure to run this command from within a "clean" git directory.`
            );
        } else {
            console.error("Problem detected:\n", error);
        }
        return null;
    }
}

const questions = [
    {
        type: "input",
        name: "FILENAME",
        message: "What is the name of the file without extension?"
    },
    {
        type: "list",
        name: "EXTENSION",
        message: "What is the file extension?",
        initial: "bork",
        choices: [".rb", ".js", ".php", ".css"],
        filter: function(val) {
            return val.split(".")[1];
        }
    }
];

async function run() {
    asyncStat();
    welcomeMessage();
    const response = ask(questions);
    console.log("response :", response);
}

async function ask(questions) {
    return await prompt(questions);
}

run();

function welcomeMessage() {
    console.log(logger.log("Let's configure that app 😉"));
}

// todo
/*
- [x] start the cli...
- [x] Ensure a clean git directory. This will be used as a "backup".
- read in files from dev dependencies
    - try just reading in a single file for now
    - ignore non-essential deps
- copy files into repository (install dir)

Other
- ensure it runs on windows
- handle errors
- prompt user before install
*/
