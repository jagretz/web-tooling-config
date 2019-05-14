#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
const chalk = require("chalk");
/* internal dependencies */
const logger = require("./src/colorLog");
const { getSourcesByProjectType, overridesFiles } = require("./src/templateSources");
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
 * Wraps success callback in a `Promise`
 */
const execPromise = promisify(exec);

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
    try {
        return await statPromise(path.join(cwd, ".git"));
    } catch (error) {
        if (error.code === "ENOENT" && error.path.endsWith(".git")) {
            /*
            The error from the child_process would produce something along the
            lines of (windows):
            errno: -4058,
            code: 'ENOENT',
            syscall: 'stat',
            path: 'C:\\git\\web-tooling-config\\packages\\web-tooling-config-cli\\.git'
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

async function checkForCleanGitDirectory() {
    try {
        const { stdout, stderr } = await execPromise("git status --porcelain");
        if (!!stdout || !!stderr) {
            logger.error(
                `Git directory not clean. Please remove or commit changes before continuing.`
            );
            process.exit();
        }
    } catch (error) {
        console.error("Problem detected:\n", error);
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
 * Compare and return the longest string in a array.
 * @param {array<string>} texts array of strings to compare lengths of
 * @return {string} the string value of the longest given string
 */
const calculateLongestText = texts =>
    Object.values(texts).reduce((longest, current) =>
        current.length > longest ? current : longest
    );

/**
 * @type {integer} the number of characters of the longest string among those checked.
 */
const longest = calculateLongestText([BROWSER, REACT, NODE]).length;

/**
 * Return a function that will pad the start of a string with whitespace equal
 * to the length of the string + #longest less the length of the string
 * @param {integer} longest
 * @returns {function} that pads the start of a string with whitespace.
 */
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

/**
 * Pad the start of a string with whitespace.
 */
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

/**
 * @param {string} filename string name of the file.
 * @return {string} fully-qualified destination
 */
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
        filenames.map(async ({ source, destination }) => {
            logger.log(`Processing ${chalk.cyan(destination)}`);

            const file = await safeReadFile(path.join(pathname, source));
            await safeWriteFile(destination, file, { flag: "w" });

            logger.log(`Copied ${chalk.cyan(destination)}`);
        })
    );
}

// declared external to the function where it is used to avoid re-creation.
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
    return Promise.all(
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
 * Asynchronously read, and synchronously parse the source projects (cwd) `package.json`
 * @return {object} the parsed package.json
 * @async
 */
async function getPackageJsonAsObject() {
    let projectPackageJson = await safeReadFile(path.join(cwd, "package.json"));
    return JSON.parse(projectPackageJson);
}

/**
 * Entry point of the CLI.
 * @async
 */
async function run() {
    await checkForExistingGitDirectory();
    await checkForCleanGitDirectory();

    welcomeMessage();

    /**
     * Prompt the user for the target project type.
     * @return {object} the users selection (answer)
     */
    const project = await prompt(projectQuestions);
    const type = project.type;

    /* Repeat users choice back to them. */
    logger.log(`Setting up project with the ${chalk.underline(type)} configs`);

    /* get templates relative to the project */
    const templateSources = getSourcesByProjectType(type);

    /* copy (read/write) all template files */
    await copyFiles(path.join(__dirname, "templates"), templateSources);

    /* create the overrides template files */
    await createFiles(overridesFiles);

    // Update the user with current progress
    logger.success("Created web-config files successfully!");
    logger.log("WIP: Gathering necessary package dependencies");

    // read the install locations package.json
    let projectPackageJsonString = await getPackageJsonAsObject();

    /*
    Have a list a deps that are to be installed given the project.type: web, react, node, etx
    You can temporarily comment out this line to save on testing time and
    pointing to the correct registry (.npmrc )
    */
    const responseCode = await installPackageDependencies(
        type,
        projectPackageJsonString.devDependencies
    );

    if (responseCode === 0) {
        // get the most recent updates (after `npm install`)
        projectPackageJsonString = await getPackageJsonAsObject();
    }

    // Update scripts package.scripts.
    const scripts = {
        ...projectPackageJsonString.scripts,
        ...getScriptsByProjectType(type)
    };
    const updatedPackageJson = JSON.stringify(
        { ...projectPackageJsonString, ...{ scripts } },
        null,
        4
    );

    /*
    Overwrite the package.json. It is not a large file so we aren't
    too concerned about memory consumption or performance with this.
    The git-diff can be used to "undo" undesired changes
    */
    await safeWriteFile("package.json", updatedPackageJson);

    logger.success("Work Complete!");
}

/* Invoke the script to start... */
run();
