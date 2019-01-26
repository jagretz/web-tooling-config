const fs = require("fs");
const path = require("path");
/** @see [promisify]{@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original} */
const { promisify } = require("util");
/** @see [child_process]{@link https://nodejs.org/api/child_process.html#child_process_child_process} */
const { exec, spawn } = require("child_process");
/** @see [enquirer]{@link https://www.npmjs.com/package/enquirer} */
const { prompt } = require("enquirer");
const chalk = require("chalk");
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
    switch (type) {
        case REACT: {
            console.log("Project is react!!!");
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

async function run() {
    await asyncStat();
    welcomeMessage();
    const project = await prompt(projectQuestions);
    selectProjectType(project.type);

    console.log("project :", project);
}

run();

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
/*
Files to copy & overwrite
- configs
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
*/
