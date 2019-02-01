const fs = require("fs");
const path = require("path");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
// /** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
// const { exec, spawn } = require("child_process");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
const chalk = require("chalk");
/* custom modules / non-node modules */
const logger = require("./src/colorLog");

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
// const execCmd = promisify(exec);

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

const calculatelongestText = texts =>
    Object.values(texts).reduce((longest, current) =>
        current.length > longest ? current : longest
    );

// const ProjectType = Object.freeze({ BROWSER: "browser", REACT: "react", NODE: "node" });
// const longest = calculatelongestText(ProjectType).length;
const BROWSER = "browser";
const REACT = "react";
const NODE = "node";

const longest = calculatelongestText([BROWSER, REACT, NODE]).length;

function formatHint(longest) {
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
    console.log(`Setting up project with the ${chalk.underline(type)} configs`);

    switch (type) {
        case REACT: {
            console.log(`Project react configs.`);
            return;
        }
        case NODE: {
            console.log("Project is node!!!");
            return;
        }
        default:
        case BROWSER: {
            console.log("Project is browser!!!");
            return;
        }
    }
}

// const target = filename => path.join(__dirname, "templates", filename);
const destination = filename => path.join(cwd, filename);

const { testFiles } = require("./src/sources");

async function safeReadFile(filename) {
    const dir = path.join(__dirname, "templates");
    const pathname = path.join("templates", filename);
    try {
        return await readFile(pathname);
    } catch (error) {
        if (error.code === "ENOENT") {
            // prints path.dirname templates
            console.log("path.dirname", path.dirname(pathname));
            // prints path.basename tar
            console.log("path.basename", path.basename(pathname));
            logger.warn(`No such file "${filename}" in directory "${dir}". Skipping file.`);
            return true;
        } else {
            logger.error(`Could not read file "${filename}" from path ${dir}`);
            throw error;
        }
    }
}

async function safeWriteFile(filename, ...rest) {
    try {
        return await writeFile(destination(filename), ...rest);
    } catch (error) {
        if (error.code === "EEXIST") {
            logger.log("Skipped");
            return true;
        } else {
            logger.error(`Could not write file "${filename}" to desitination `);
            throw error;
        }
    }
}

async function copyFiles(filenames) {
    return await filenames.map(async filename => {
        logger.log(`Processing ${chalk.cyan(filename)}`);
        const file = await safeReadFile(filename);

        await safeWriteFile(filename, file, { flag: "w" });
        logger.log(`Copied ${chalk.cyan(filename)}`);
    });
}

async function run() {
    // console.log("cwd", cwd); // The dir where the script is invoked
    // console.log("__dirname", __dirname); // The dir where the (invoked) script is defined

    await asyncStat();
    welcomeMessage();
    const project = await prompt(projectQuestions);
    selectProjectType(project.type);
    console.log("project :", project);

    /* copy (raed/write) all files */
    await copyFiles(testFiles);
    console.log("Copy ALL files success");
}

run();

/*
todo

- [x] start the cli...
- [x] Prompt user before install
- [x] Ensure a clean git directory. This will be used as a "backup".
- [x] read in files from local directory
- [x] try just reading in a single file for now
- [x] copy files into repository (install dir)

After functionality is implemented:

- [ ] test that the cli runs on windows (POSIX)
- [ ] test that the cli runs on osx

Hardening & cleanup

- [ ] Add error handling
- [ ] Add logging
- [ ] Add testing

Additional functionality

- [ ] Combine eslint configurations
- [ ] Add a loading spinner or some sort of loading indicator
- [ ] Add an eslint & stylelint overrides file _ONLY_ if one does not already exist
- [ ] Add package dependencies
- [ ] Install package dependencies
- [ ] On build, clean `/templates` & copy configs from sister packages into `/templates`
  - Perhaps use same read + write logic and take advantage of abstraction to use
    in different parts of the app: build and cli

Files to copy & overwrite

- prettier
- stylelint
- editorconfig
- eslint (which one???)
    - pojo - browser / base
    - react - browser
    - node
- eslint overrides (empty file)
    ! This should only copy over _if_ there isn't already an overrides file
- stylelint overrides (empty file)
    ! This should only copy over _if_ there isn't already an overrides file
- gitignore
- eslintignore
- stylintignore
- prettierignore


Questions / Thoughts?
- [x] ? pull in files from dev dependencies?
    - No


*/
