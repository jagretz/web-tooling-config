const fs = require("fs");
const path = require("path");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
const chalk = require("chalk");
/* internal dependencies */
const logger = require("./src/colorLog");
// const { leftOuterJoin, safeSpawn } = require("./src/utils");
const { configFiles, overridesFiles } = require("./src/templateSources");
const { installPackageDependencies } = require("./src/packageDependencies");
const { getScriptsByProjectType } = require("./src/packageScripts");
const { BROWSER, REACT, NODE } = require("./src/projectTypes");

const cwd = process.cwd();

/**
 * Wraps success callback in a `Promise`
 */
const readFile = promisify(fs.readFile);

/**
 * Wraps success callback in a `Promise`
 * @see https://nodejs.org/api/fs.html#fs_fs_write_fd_string_position_encoding_callback
 * @see [File System Flags]{@link https://nodejs.org/api/fs.html#fs_file_system_flags}
 */
const writeFile = promisify(fs.writeFile);

/**
 * Wraps success callback in a `Promise`
 * @see [fs.stat]{@link https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback}
 * @see [Stats object] {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
 */
const statPromise = promisify(fs.stat);

/**
 * This will check the install directory for an existing `.git` directory. If
 * a `.git` directory does not exist, log an error and exit.
 *
 * The reason to run this check is to prevent the end-user from unintentionally
 * mixing in changes made from _this_ application with uncommitted changes
 * in their project.
 *
 * Logs any error to stdout and exits if any error is thrown.
 *
 * @returns {Promise resolves fs.stat} no processing necessary on the Prommise
 * or the resolve to `fs.stat`. The return simple means success.
 * @async
 */
async function checkForExistingGitDirectory() {
    // let stats;
    try {
        return await statPromise(path.join(cwd, ".git"));
        // console.log(`Success! ${stats}`);
    } catch (error) {
        if (error.code === "ENOENT" && error.path.endsWith(".git")) {
            /*
            The error from the child_process would produce something along the
            lines of (windows):
            errno: -4058,
            code: 'ENOENT',
            syscall: 'stat',
            path: 'C:\\git\\web-configs\\packages\\web-configs-cli\\.git'
            */
            logger.error(
                `Git not detected. Make sure to run this command from within a "clean" git directory.`
            );
        } else {
            console.error("Problem detected:\n", error);
        }
        process.exit();
    }
}

/**
 * Logs a welcome message to the end-user.
 */
function welcomeMessage() {
    logger.log("Let's configure that app 😉");
}

/**
 *
 * @param {array<string>} texts
 */
// TODO: 03/16 jagretz - document
const calculateLongestText = texts =>
    Object.values(texts).reduce((longest, current) =>
        current.length > longest ? current : longest
    );

// const ProjectType = Object.freeze({ BROWSER: "browser", REACT: "react", NODE: "node" });
// const longest = calculatelongestText(ProjectType).length;

// TODO: 03/16 jagretz - document
const longest = calculateLongestText([BROWSER, REACT, NODE]).length;

// TODO: 03/16 jagretz - document
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

/**
 * Questions about the type of project the user is targeting.
 * Configured to be uses with `enquirer.prompt`
 */
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
// TODO: 03/16 jagretz - document
// const target = filename => path.join(__dirname, "templates", filename);
const destination = filename => path.join(cwd, filename);

/**
 * Looks at the directory of the cli for a `templates`
 * directory to read files by #filename from.
 *
 * On Error, logs and re-throws.
 *
 * @param {string} filename the name of the file to read.
 * @returns {Promise}
 * @throws {Error} failure to read the file.
 * @async
 */
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

/**
 * Looks at the directory where the cli was invoked to write a file.
 *
 * On Error, logs and re-throws.
 *
 * This will create a new file with the name of #filename or overwrite a file
 * with the same name if one already exists.
 *
 * @param {string} filename the name of the file to write new or overwrite.
 * @returns {Promise}
 * @throws {Error} failure to write the file.
 * @async
 */
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

/**
 * Read and write files from the cli package to the location where
 * the cli was invoked.
 *
 * @param {string} pathname directory to find the files specified by #filenames
 * @param {array<string>} filenames array of names for each file to copy.
 * @returns {Promise} The return simple means success.
 * @async
 */
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
 * Creates a new file for each name in #filenames.
 * Logs the result of the operation to stdout.
 *
 * @param {Array<String>} filenames names of the files to create (write).
 * @returns {Promise}
 * @async
 */
async function createFiles(filenames) {
    return await Promise.all(
        filenames.map(async filename => {
            /*
            The use of `fs.stat` to check if a file exists is _NOT_ recommended.
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

/**
 * Entry point of the CLI.
 * @async
 */
async function run() {
    console.log("cwd", process.cwd());
    await checkForExistingGitDirectory();

    welcomeMessage();

    /**
     * Prompt the user for the target project type.
     * @return {object} the users selection (answer)
     */
    const project = await prompt(projectQuestions);

    /* Repeat users choice back to them. */

    logger.log(`Setting up project with the ${chalk.underline(project.type)} configs`);

    /* copy (read/write) all template files */
    await copyFiles(path.join(__dirname, "templates"), configFiles);

    /* create the overrides template files */
    await createFiles(overridesFiles);

    // Update the user with current progress
    logger.success("Created web-config files successfully!");
    logger.log("WIP: Gathering necessary package dependencies");

    // read the install locations package.json
    const projectPackageJson = await safeReadFile(path.join(cwd, "package.json"));

    // TODO: 03/16 jagretz - can likely be abstracted as a separate step
    // * this is the install step
    const projectPackageJsonString = JSON.parse(projectPackageJson);

    // Have a list a deps that are to be installed given the project.type: web, react, node, etx
    // temp comment out to save on testing time and pointing to the correct registry (.npmrc )
    // await installPackageDependencies(project.type, projectPackageJsonString.devDependencies);

    // TODO: 03/16 jagretz - can likely be abstracted as a separate step
    // * this is the overwrite `scripts` step
    // overwrite scripts -- sarz bro :D
    const scripts = {
        ...projectPackageJsonString.scripts,
        ...getScriptsByProjectType(project.type)
    };
    const updatedPackageJson = JSON.stringify({ ...projectPackageJsonString, ...{ scripts } });

    // overwrite package.json... it's not _that_ large of a file so I am not
    // too concerned about memory consumption or performance with this.
    await safeWriteFile("package.json", updatedPackageJson);

    logger.success("Work Complete!");
}

/* Invoke the script to start... */
run();

/*
Complete

- [x] start the cli...
- [x] Prompt user before install
- [x] Ensure a clean git directory. This will be used as a "backup".
- [x] read in files from local directory
- [x] try just reading in a single file for now
- [x] copy files into repository (install dir)
- [x] Add an eslint & stylelint overrides file _ONLY_ if one does not already exist
- [x] merge into package.json `devDependencies` with matching keys
- [x] Install package dependencies
- [x] merge into package.json `scripts` with matching keys

In Progress

- [ ] Add / update js docs


Ready for Development

- [ ] Update package.json scripts
- [ ] Remove bogus comments
- [x] test that the cli runs on windows
- [ ] test that the cli runs on osx
- [ ] Add error handling
- [ ] Add logging
- [ ] Add testing
- [ ] Add / update project documentation
- [ ] Publish to npm
- [ ] Publish as an npx script
- [ ] Take care of the below error, "disconnected-state"


Backlog

- [ ] On build, clean `/templates` & copy configs from sister packages into `/templates`
    - Perhaps use same read + write logic and take advantage of abstraction to use
    in different parts of the app: build and cli
- Add a build system to obfuscate and minify. This package is already small, but making it
smaller makes it easier easier to publish and download from an end-user standpoint.
- [ ] Update package dependencies to install -- currently the list is small for testing purposes.

Out of Scope

- [ ] Add a loading spinner for install process

Other linters?

- markdown https://github.com/airbnb/javascript/blob/master/linters/.markdownlint.json
- graphql -

*/

/*
Error - disconnected-state

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
