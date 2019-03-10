const fs = require("fs");
const path = require("path");
// /** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
const { spawn } = require("child_process");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
const chalk = require("chalk");
/* custom modules / non-node modules */
const logger = require("./src/colorLog");
const { filterPackageDependencies, safeSpawn } = require("./src/utils");
const { getDevDependenciesByProjectType } = require("./src/packageSources");
const { getScriptsByProjectType } = require("./src/packageScripts");

const cwd = process.cwd();

const readFile = promisify(fs.readFile);
/**
 * @see https://nodejs.org/api/fs.html#fs_fs_write_fd_string_position_encoding_callback
 * @see [File System Flags]{@link https://nodejs.org/api/fs.html#fs_file_system_flags}
 */
const writeFile = promisify(fs.writeFile);

/**
 * @see [fs.stat]{@link https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback}
 * @see [Stats object] {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
 */
const statPromise = promisify(fs.stat);

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
        process.exit();
        // return null;
    }
}

function welcomeMessage() {
    logger.log("Let's configure that app 😉");
}

// const questions = [
//     {
//         type: "input",
//         name: "FILENAME",
//         message: "What is the name of the file without extension?"
//     },
//     {
//         type: "list",
//         name: "EXTENSION",
//         message: "What is the file extension?",
//         initial: "bork",
//         choices: [".rb", ".js", ".php", ".css"],
//         filter: function(val) {
//             return val.split(".")[1];
//         }
//     }
// ];

const calculateLongestText = texts =>
    Object.values(texts).reduce((longest, current) =>
        current.length > longest ? current : longest
    );

// const ProjectType = Object.freeze({ BROWSER: "browser", REACT: "react", NODE: "node" });
// const longest = calculatelongestText(ProjectType).length;
const BROWSER = "browser";
const REACT = "react";
const NODE = "node";

const longest = calculateLongestText([BROWSER, REACT, NODE]).length;

function formatHint(longest) {
    /**
     * Pad the start of the `hint` with the whitespace equal to the length
     * of the longest name minus the hint name.
     *
     * This allows a list of hints to be printed (output) with equal spacing
     * between the hint name and the hint itself. ie
     *
     * ```bash
     * FirstHintName  the hint for FirstHintName.
     * foohint        the hint for foo.
     * ```
     */

    return (name, hint) => {
        return `${hint.padStart(hint.length + longest - name.length)}`;
    };
}
const padHint = formatHint(longest);

const projectQuestions = {
    type: "select",
    name: "type",
    message: "What type of project do you want to configure?",
    choices: [
        {
            name: BROWSER,
            message: `${BROWSER}?`,
            hint: chalk.gray(padHint(BROWSER, "(plain old javascript apps)"))
        },
        {
            name: REACT,
            message: `${REACT}?`,
            hint: chalk.gray(padHint(REACT, "(create-react-app)"))
        },
        {
            name: NODE,
            message: `${NODE}?`,
            hint: chalk.gray(padHint(NODE, "(node cli, scripts, native apps)"))
        }
    ]
};

function selectProjectType(type) {
    // console.log(`Setting up project with the ${chalk.underline(type)} configs`);
    logger.log(`Setting up project with the ${chalk.underline(type)} configs`);

    // temporary switch that does nothing be print a line to the console.
    // I am not sure if this is needed anymore but saving until complete
    // switch (type) {
    //     case REACT: {
    //         console.log(`Project react configs.`);
    //         return;
    //     }
    //     case NODE: {
    //         console.log("Project is node!!!");
    //         return;
    //     }
    //     default:
    //     case BROWSER: {
    //         console.log("Project is browser!!!");
    //         return;
    //     }
    // }
}

// const target = filename => path.join(__dirname, "templates", filename);
const destination = filename => path.join(cwd, filename);

const { configFiles, overridesFiles } = require("./src/sources");

async function safeReadFile(filename) {
    try {
        return await readFile(filename);
    } catch (error) {
        const dir = path.join(__dirname, "templates");

        if (error.code === "ENOENT") {
            logger.warn(`No such file "${filename}". Skipping file.`);
            return true;
        } else {
            logger.error(`Could not read file "${filename}"`);
            throw error;
        }
    }
}

async function safeWriteFile(filename, ...rest) {
    try {
        return await writeFile(destination(filename), ...rest);
    } catch (error) {
        if (error.code === "EEXIST") {
            logger.log(`${chalk.yellow("Skipped")} ${chalk.cyan(filename)} - File already exists.`);
            return true;
        } else {
            logger.error(`Could not write file "${filename}" to desitination `);
            throw error;
        }
    }
}

async function copyFiles(pathname, filenames) {
    return Promise.all(
        filenames.map(async filename => {
            logger.log(`Processing ${chalk.cyan(filename)}`);

            const file = await safeReadFile(path.join(pathname, filename));
            await safeWriteFile(filename, file, { flag: "w" });

            logger.log(`Copied ${chalk.cyan(filename)}`);
        })
    );
}

const fileContents = "module.exports = {}";

/**
 * Creates a new file. Logs the result of the operation to stdout.
 *
 * @param {*} filenames
 * @returns
 * @async
 */
async function createFiles(filenames) {
    return await Promise.all(
        filenames.map(async filename => {
            /*
            The use of `fs.stat` to check if a file exists is _NOT_ recommmended.
            @see [fs.stat]{@link https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback}
            */
            const fileExists = await safeWriteFile(filename, fileContents, {
                flag: "wx"
            });
            if (!fileExists) {
                logger.log(`Created ${chalk.cyan(filename)}`);
            }
        })
    );
}

function spawnNpmProcess() {
    return spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        // testing... comment / uncomment lines to test.
        // ["install", "husky", "jagretz"],
        ["install", "--save-dev", "husky"],
        {
            stdio: "inherit"
        }
    );
}

// main function that runs the script
async function run() {
    // console.log("cwd", cwd); // The dir where the script is invoked
    // console.log("__dirname", __dirname); // The dir where the (invoked) script is defined

    await asyncStat();
    welcomeMessage();
    const project = await prompt(projectQuestions);
    selectProjectType(project.type);
    console.log("project :", project);

    /* copy (read/write) all template files */
    await copyFiles(path.join(__dirname, "templates"), configFiles);

    /* create overrides files */
    await createFiles(overridesFiles);

    logger.success("Created web-config files successfully!");
    logger.log("WIP: Gathering necessary package dependencies");

    // read the destination (current) projects package.json
    const projectPackageJson = await safeReadFile(path.join(cwd, "package.json"));
    const projectPackageJsonString = JSON.parse(projectPackageJson);
    console.log(
        "projectPackageJsonString.devDependencies",
        projectPackageJsonString.devDependencies
    );
    // Have a list a deps that are to be installed given the project.type: web, react, node, etx
    const devDependenciesToInclude = getDevDependenciesByProjectType(project.type);
    // console.log("devDependenciesToInclude", devDependenciesToInclude);
    // filter only 'unique" dependencies between the dest. proj. and the list of deps
    const devDependenciesToInstall = filterPackageDependencies(
        devDependenciesToInclude,
        projectPackageJsonString.devDependencies
    );

    console.log("Acquired devDependenciesToInstall:", devDependenciesToInstall);

    // install "unique" dependencies into the dest. projects (cwd) `devDependencies`.
    // const code = await safeSpawn(spawnNpmProcess);
    // if (code === 0) {
    //     logger.success("Successfully installed package dependencies.");
    // } else {
    //     logger.error("Failed to install package dependencies.");
    // }

    /* Current WIP -- write `package.scripts` to the cwd package.json */

    logger.success("Work Complete!");
}

// invoke the script to start.
run();

/*
todo

- [x] start the cli...
- [x] Prompt user before install
- [x] Ensure a clean git directory. This will be used as a "backup".
- [x] read in files from local directory
- [x] try just reading in a single file for now
- [x] copy files into repository (install dir)
- [x] Install package dependencies

In Progress

- [ ] merge into package.json `scripts` with matching keys

Backlog

- [ ] Add a loading spinner for install process
- [ ] On build, clean `/templates` & copy configs from sister packages into `/templates`
- Perhaps use same read + write logic and take advantage of abstraction to use
in different parts of the app: build and cli
- Add a build system to obfuscate and minify. This is small, but making it
smaller makes it easier easier to publish and download from a users standpoint.
- [ ] Update package dependencies to install -- currently the list is small for testing purposes.


Complete

- [x] Add an eslint & stylelint overrides file _ONLY_ if one does not already exist
- [x] merge into package.json `devDpendencies` with matching keys

Hardening & cleanup

- [ ] Add / update js docs
- [ ] Remove bogus comments
- [x] test that the cli runs on windows
- [ ] test that the cli runs on osx
- [ ] Add error handling
- [ ] Add logging
- [ ] Add testing
- [ ] Add / update project documentation
- [ ] Publish to npm
- [ ] Publish as an npx script

Other linters?

- markdown https://github.com/airbnb/javascript/blob/master/linters/.markdownlint.json
- graphql -

*/

/*
Error received on npm install

Not connected to the internet

web-configs | WIP: Installing package dependencies
(node:23032) UnhandledPromiseRejectionWarning: Error: Command failed: npm install husky lint-staged
npm WARN registry Using stale data from https://registry.npmjs.org/ because the host is inaccessible -- are you offline?
npm WARN registry Using stale package data from https://registry.npmjs.org/ due to a request error during revalidation.
npm ERR! code ETARGET
npm ERR! notarget No matching version found for lint-staged@^2.3.0
npm ERR! notarget In most cases you or one of your dependencies are requesting
npm ERR! notarget a package version that doesn't exist.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\gretzj\AppData\Roaming\npm-cache\_logs\2019-03-09T18_15_57_088Z-debug.log

    at ChildProcess.exithandler (child_process.js:294:12)
    at ChildProcess.emit (events.js:189:13)
    at maybeClose (internal/child_process.js:970:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:259:5)
(node:23032) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:23032) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

*/
